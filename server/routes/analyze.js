const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { analyzeSkills } = require("../utils/ai");

const router = express.Router();

// Set up multer for file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/resume", upload.single("resume"), async (req, res) => {
  try {
    const { targetRole } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }
    
    if (!targetRole) {
      return res.status(400).json({ error: "Target role is required" });
    }

    // Parse PDF
    let resumeText = "";
    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text || "";
    } catch (e) {
      console.warn("pdf-parse failed to extract text natively, falling back to Gemini OCR.");
    }

    if (!resumeText.trim()) {
      console.warn("PDF appears to be empty or image-based, relying on Gemini to read the document.");
    }

    // Analyze with AI, passing the buffer natively to Gemini
    const analysis = await analyzeSkills(resumeText, targetRole, req.file.buffer);
    
    res.json(analysis);
  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume" });
  }
});

module.exports = router;
