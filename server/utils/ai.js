const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini client (requires GEMINI_API_KEY environment variable)
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- ML Hybrid Helper Functions ---
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    return Array(768).fill(0.1); // mock embedding
  }
  try {
    const response = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });
    if (response && response.embeddings && response.embeddings.length > 0) {
      return response.embeddings[0].values;
    }
    return response.values || Array(768).fill(0.1);
  } catch (err) {
    console.error("Embedding error:", err);
    return Array(768).fill(0.1); 
  }
}


async function generateAIResponse(prompt, isGithub = false, fileBuffer = null) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.warn("Using mock AI response because GEMINI_API_KEY is not configured.");
    
    const mockGithub = {
      readinessScore: 75,
      strengths: ["Consistent commit history", "Experience with modern web frameworks", "Good documentation practices"],
      weaknesses: ["Lack of testing in repositories", "Fewer contributions to open-source organizations"],
      recommendations: ["Add unit and integration tests to your top repos", "Contribute to larger open-source projects", "Write more detailed architecture documentation"]
    };

    const mockResume = {
      readinessScore: 82,
      extractedSkills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
      missingSkills: ["Docker", "AWS", "CI/CD", "TypeScript"],
      roadmap: [
        "Learn Docker fundamentals and containerize your current full-stack app",
        "Set up a CI/CD pipeline using GitHub Actions",
        "Deploy your containerized app to AWS ECS or similar service",
        "Migrate one of your React projects to TypeScript"
      ],
      projectRecommendations: [
        { title: "DevOps Pipeline setup", description: "Create a full CI/CD pipeline for your existing React/Node app using GitHub Actions and Docker." },
        { title: "Cloud Deployment", description: "Deploy an application to AWS using ECS and RDS to show cloud proficiency." }
      ]
    };

    return JSON.stringify(isGithub ? mockGithub : mockResume);
  }

  try {
    let requestContents = prompt;
    if (fileBuffer) {
      requestContents = [
        {
          inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType: "application/pdf"
          }
        },
        { text: prompt }
      ];
    }

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: requestContents,
      config: {
        temperature: 0.0,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    throw new Error("Failed to communicate with Gemini API: " + (error.message || "Unknown error"));
  }
}

async function analyzeSkills(resumeText, targetRole, fileBuffer = null) {
  const prompt = `
    You are an expert technical recruiter and career coach.
    Here is a candidate's resume text:
    ---
    ${resumeText || "(Resume provided as an attached PDF document)"}
    ---
    
    The candidate wants to be a: ${targetRole}
    
    Based on the resume and the target role, provide a JSON response with the following format:
    {
      "extractedSkills": [<list of skills found in the resume>],
      "requiredSkills": [<list of all critical skills required for the ${targetRole} role>],
      "missingSkills": [<list of critical skills they are missing for the ${targetRole} role>],
      "roadmap": [<list of 3-5 steps they should take to learn the missing skills>],
      "projectRecommendations": [
        { "title": "<project name>", "description": "<short description>" }
      ]
    }
    
    Ensure the response is STRICTLY valid JSON without markdown wrapping.
  `;
  
  const resultText = await generateAIResponse(prompt, false, fileBuffer);
  try {
    const cleanedText = resultText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    
    // ML Hybrid: Compute score via embeddings
    const candidateSkillsText = (parsed.extractedSkills || []).join(", ");
    const roleSkillsText = (parsed.requiredSkills || parsed.extractedSkills.concat(parsed.missingSkills)).join(", ");
    
    if (candidateSkillsText && roleSkillsText) {
      const candidateEmbedding = await getEmbedding(candidateSkillsText);
      const roleEmbedding = await getEmbedding(roleSkillsText);
      const similarity = cosineSimilarity(candidateEmbedding, roleEmbedding);
      
      // Convert Cosine Similarity to a percentage score (scale it nicely)
      const rawScore = Math.round(similarity * 100);
      parsed.readinessScore = Math.min(100, Math.max(0, rawScore));
    } else {
      parsed.readinessScore = 0;
    }
    
    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON from AI:", resultText);
    throw new Error("Failed to generate skill analysis.");
  }
}

async function analyzeGitHubProfile(profileData, reposData, targetRole) {
  const reposSummary = reposData.map(repo => `${repo.name}: ${repo.description} (${repo.language})`).join('\n');
  const prompt = `
    You are an expert technical recruiter and open-source evaluator.
    Here is a candidate's GitHub profile data:
    Bio: ${profileData.bio}
    Public Repos: ${profileData.public_repos}
    Followers: ${profileData.followers}
    
    Top repositories:
    ${reposSummary}
    
    The candidate wants to be a: ${targetRole}
    
    Provide a JSON response with the following format:
    {
      "detectedSkills": [<list of technologies and concepts they know based on their repos>],
      "requiredRoleSkills": [<list of critical skills required for ${targetRole}>],
      "strengths": [<list of strengths based on their repos>],
      "weaknesses": [<list of weaknesses or missing practical experience>],
      "recommendations": [<list of things they should build or contribute to next>]
    }
    
    Ensure the response is STRICTLY valid JSON without markdown wrapping.
  `;
  
  const resultText = await generateAIResponse(prompt, true);
  try {
    const cleanedText = resultText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    
    // ML Hybrid: Compute score via embeddings
    const candidateSkillsText = (parsed.detectedSkills || []).join(", ");
    const roleSkillsText = (parsed.requiredRoleSkills || []).join(", ");
    
    if (candidateSkillsText && roleSkillsText) {
      const candidateEmbedding = await getEmbedding(candidateSkillsText);
      const roleEmbedding = await getEmbedding(roleSkillsText);
      const similarity = cosineSimilarity(candidateEmbedding, roleEmbedding);
      
      const rawScore = Math.round(similarity * 100);
      parsed.readinessScore = Math.min(100, Math.max(0, rawScore));
    } else {
      parsed.readinessScore = 0;
    }
    
    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON from AI:", resultText);
    throw new Error("Failed to generate GitHub analysis.");
  }
}

module.exports = {
  generateAIResponse,
  analyzeSkills,
  analyzeGitHubProfile
};
