# SkillGap AI

AI-powered career intelligence platform that analyzes resumes, GitHub profiles, and skillsets to help students become job-ready faster.

---

## 🚀 Problem Statement

Students often struggle to understand:

* Which skills companies actually require
* What they are missing for a target role
* How job-ready they are
* Which projects or technologies to learn next

Most learning platforms provide generic content instead of personalized career guidance.

---

## 💡 Solution

SkillGap AI bridges the gap between student skills and industry expectations using AI-driven analysis.

Users can:

* Upload resumes
* Analyze GitHub profiles
* Compare skills against real job roles
* Receive personalized learning roadmaps
* Get AI-generated project recommendations
* Track career readiness scores

---

## ✨ Features

### 📄 Resume Analysis

* Extracts skills from uploaded resumes
* Detects missing technologies
* ATS-friendly analysis

### 🧠 AI Skill Gap Detection

* Compares user skills with target roles
* Generates personalized improvement plans

### 💻 GitHub Profile Analysis

* Evaluates repositories and tech stack
* Measures coding consistency and activity

### 📊 Career Readiness Score

* AI-generated score for selected job roles
* Example:

  * Data Analyst → 72% Ready
  * Frontend Developer → 58% Ready

### 🛣️ Personalized Learning Roadmap

* Suggests:

  * Courses
  * Technologies
  * Projects
  * Certifications

### 🎯 AI Project Recommendations

* Suggests resume-worthy projects based on missing skills

### 🤖 AI Career Assistant

* Interactive chatbot for:

  * Career advice
  * Interview guidance
  * Skill suggestions

---

## 🔒 Privacy & Security

SkillGap AI is built with privacy in mind. **We do not store your personal data or resumes.**
* **100% In-Memory Processing:** When a resume is uploaded, it is held securely in temporary server RAM (`multer.memoryStorage()`) just long enough to extract the necessary text or pass it to the AI.
* **No Database Storage:** Uploaded files and generated analyses are **never** written to a database or saved to a local disk.
* **Ephemeral Data:** Once the AI completes the analysis and the personalized roadmap is sent back to your browser, all related data is instantly and permanently erased from the server.

---

## 🏗️ Tech Stack

### Frontend

* Next.js
* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### AI & APIs

* Google Gemini API (2.5 Flash for multimodal analysis)
* GitHub API

### Deployment

* Vercel (Frontend)
* Render / Railway (Backend)

---

## 📂 Project Structure

```bash
SkillGap-AI/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── styles/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   └── config/
│
├── README.md
└── package.json
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Arijit-x/SkillGap-With-AI.git
cd SkillGap-With-AI
```

### Install Dependencies

```bash
npm install
```

### Start Frontend

```bash
cd client
npm install
npm run dev
```

### Start Backend

```bash
cd server
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory.

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token_optional
```

---

## 🧠 How It Works

1. User uploads resume or GitHub profile
2. AI extracts technical skills
3. System compares skills with industry role requirements
4. Missing skills are identified
5. Personalized roadmap is generated
6. User receives:

   * readiness score
   * project suggestions
   * career recommendations

---

## 📸 Demo Workflow

```text
Upload Resume
      ↓
Skill Extraction
      ↓
AI Gap Analysis
      ↓
Readiness Score
      ↓
Roadmap + Project Suggestions
```

---

## 🎯 Target Users

* College students
* Freshers
* Career switchers
* Internship seekers

---

## 🌍 Real-World Impact

SkillGap AI helps students:

* become industry-ready faster
* reduce confusion in learning paths
* improve employability
* build stronger portfolios

---

## 🔮 Future Scope

* AI mock interviews
* LinkedIn profile optimization
* Real-time job matching
* Multilingual support
* Company-specific preparation
* Internship recommendation engine

---

## 👨💻 Contributors

* Arijit Patra
* Team Members

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ Why SkillGap AI?

SkillGap AI is not just another learning platform.

It acts like a personal AI career mentor that helps students understand:

* where they stand,
* what they lack,
* and how to reach their dream role faster.
