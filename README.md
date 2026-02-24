# SkillBridge – OpenAI-Powered Employability Analysis

SkillBridge is a full-stack web application that analyzes user resumes and uses the OpenAI API to extract skills, perform skill gap analysis against a target job role, and (upcoming) recommend personalized learning paths.

---

## 🚀 Features (Completed)

### Backend (Flask)
- Resume upload (PDF/DOCX)
- Resume text extraction
- OpenAI-based skill extraction (technical skills, soft skills, tools/technologies)
- OpenAI-based skill gap analysis (matched skills, missing skills, readiness score)
- REST API for frontend–backend communication
- Secure API key handling using environment variables

### Frontend (React + Vite)
- Simple and clean UI for resume upload
- Target job role input
- Displays extracted skills
- Displays skill gap analysis results (matched skills, missing skills, readiness score)
- Success and error feedback for API calls

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python (Flask) |
| Frontend | React (Vite) |
| AI | OpenAI API |
| Version Control | Git & GitHub |

---

## ▶️ How to Run the Project

### Backend
```bash
cd backend
venv\Scripts\activate
python app.py
```

The backend will run at: `http://127.0.0.1:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open the frontend in your browser at the URL shown in the terminal (usually `http://localhost:5173`).

---

## 📁 Project Structure
```
skillbridge/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── routes/
│   ├── services/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```