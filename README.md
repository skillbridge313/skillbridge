# SkillBridge 🌉

> AI-Powered Career Readiness Analysis Platform

SkillBridge is a full-stack web application that analyzes your resume and leverages OpenAI's powerful language models to extract skills, identify skill gaps, recommend personalized courses, and generate a structured learning plan tailored to your target job role.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Screenshot](#screenshot)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality

- **📄 Resume Upload & Parsing**
  - Support for PDF and DOCX formats
  - Automatic text extraction using PyPDF2 and python-docx
  - Seamless file handling and validation

- **🧠 AI-Powered Skill Extraction**
  - OpenAI-based skill extraction using GPT models
  - Categorizes skills into: Technical Skills, Soft Skills, Tools & Technologies
  - Intelligent parsing and deduplication

- **🎯 Smart Skill Gap Analysis**
  - Compares extracted skills against target job role requirements
  - Calculates readiness percentage score
  - Identifies matched and missing skills
  - Provides data-driven insights

- **📚 Personalized Course Recommendations**
  - AI-driven course suggestions for each missing skill
  - Aggregates recommendations from multiple platforms
  - Provides skill-based learning pathways

- **📋 Intelligent Learning Plan Generation**
  - Creates structured, prioritized learning plans
  - Includes timelines and milestones
  - Markdown-formatted for easy sharing and printing
  - Actionable steps with resource suggestions

### UI/UX Enhancements

- **🎨 Modern, Responsive Design**
  - Clean, intuitive interface with gradient styling
  - Fully responsive for desktop, tablet, and mobile
  - Smooth animations and transitions
  - Dark/light theme compatible

- **🔄 Real-time Feedback**
  - Loading states and progress indicators
  - Success and error message notifications
  - Tab-based results navigation
  - Visual readiness score display

- **♿ Accessibility**
  - WCAG 2.1 compliant color contrasts
  - Semantic HTML structure
  - Keyboard navigation support
  - Clear focus indicators

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | ^18.0 |
| **Build Tool** | Vite | ^4.0 |
| **Frontend Styling** | CSS3 (Modern) | - |
| **Markdown Rendering** | react-markdown | ^9.0 |
| **Backend** | Python Flask | ^2.0 |
| **Document Parsing** | PyPDF2, python-docx | Latest |
| **AI Engine** | OpenAI API (GPT-4/3.5) | Latest |
| **Version Control** | Git & GitHub | - |

---

## 📁 Project Structure

```
skillbridge/
├── backend/
│   ├── app.py                          # Flask application entry point
│   ├── config.py                       # Configuration settings
│   ├── requirements.txt                # Python dependencies
│   ├── routes/
│   │   ├── __init__.py
│   │   └── resume_routes.py            # Resume-related endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── resume_parser.py            # PDF/DOCX parsing logic
│   │   ├── openai_skill_extractor.py   # Skill extraction service
│   │   ├── openai_gap_analyzer.py      # Gap analysis service
│   │   ├── openai_course_recommender.py # Course recommendation service
│   │   └── openai_learning_plan.py     # Learning plan generation service
│   └── uploads/                        # Temporary resume storage
│
├── frontend/
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # NPM dependencies and scripts
│   ├── vite.config.js                  # Vite configuration
│   ├── public/                         # Static assets
│   └── src/
│       ├── main.jsx                    # React app entry point
│       ├── App.jsx                     # Main App component
│       ├── App.css                     # App-specific styles
│       └── index.css                   # Global styles
│
├── .gitignore
├── README.md                           # This file
└── LICENSE                             # Project license
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** - [Download](https://www.python.org/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

5. **Verify the configuration:**
   ```bash
   python -c "from config import Config; print(Config.OPENAI_API_KEY[:5] + '...' if Config.OPENAI_API_KEY else 'Not set')"
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify the setup:**
   ```bash
   npm list react react-markdown
   ```

---

## 🏃 Running the Project

### Start the Backend Server

```bash
cd backend
# Activate virtual environment (if not already activated)
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate      # Windows

# Run the Flask app
python app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:5000
```

The backend API will be available at: `http://127.0.0.1:5000`

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open your browser and navigate to `http://localhost:5173/`

### Production Build

To create an optimized production build:

```bash
cd frontend
npm run build
```

The build artifacts will be in the `dist/` directory.

---

## 🔌 API Endpoints

### 1. Upload Resume & Extract Skills

**POST** `/upload-resume`

**Request:**
```bash
curl -X POST -F "resume=@path/to/resume.pdf" http://127.0.0.1:5000/upload-resume
```

**Response:**
```json
{
  "skills": {
    "technical_skills": ["Python", "Machine Learning", "TensorFlow"],
    "soft_skills": ["Leadership", "Communication"],
    "tools": ["Git", "Docker", "AWS"]
  }
}
```

### 2. Analyze Skill Gap

**POST** `/analyze-gap`

**Request:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "skills": {
      "technical_skills": ["Python", "Machine Learning"],
      "soft_skills": ["Communication"],
      "tools": ["Git"]
    },
    "target_role": "AI/ML Engineer"
  }' \
  http://127.0.0.1:5000/analyze-gap
```

**Response:**
```json
{
  "gap_analysis": {
    "matched_skills": ["Python", "Machine Learning"],
    "missing_skills": ["Deep Learning", "PyTorch", "Cloud Deployment"],
    "readiness_score": 65
  }
}
```

### 3. Recommend Courses

**POST** `/recommend-courses`

**Request:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "missing_skills": ["Deep Learning", "PyTorch"]
  }' \
  http://127.0.0.1:5000/recommend-courses
```

**Response:**
```json
{
  "courses": [
    {
      "skill": "Deep Learning",
      "recommended_courses": [
        "Deep Learning Specialization - Coursera",
        "Deep Learning with PyTorch - Udacity"
      ]
    }
  ]
}
```

### 4. Generate Learning Plan

**POST** `/generate-plan`

**Request:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "missing_skills": ["Deep Learning", "PyTorch"]
  }' \
  http://127.0.0.1:5000/generate-plan
```

**Response:**
```json
{
  "learning_plan": "# Your Personalized Learning Plan\n\n## Week 1-2: Foundation Building\n..."
}
```

---

## 🧠 How It Works

### The AI Pipeline

```
┌─────────────┐
│  Resume PDF │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  Resume Parser       │
│  (PyPDF2/python-docx)│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  OpenAI GPT Model    │
│  Skill Extraction    │ ◄──── Prompt Engineering
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Extracted Skills    │
│  (Technical/Soft)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Gap Analysis        │
│  (vs Target Role)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Course & Plan Gen   │
│  (OpenAI)            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  User-Friendly UI    │
│  (React + Vite)      │
└──────────────────────┘
```

### Key Technologies

- **PyPDF2**: Extracts text from PDF resumes
- **python-docx**: Parses Word document resumes
- **OpenAI API**: Powers intelligent skill extraction, gap analysis, and learning plan generation
- **Prompt Engineering**: Carefully crafted prompts for consistent, high-quality outputs

---

## 📸 Screenshot

Here's what the application looks like:

[SkillBridge UI](screenshots/skillbridge-ui.png)

---

## 🚀 Future Enhancements

- [ ] **Database Integration**: Store user profiles and results
- [ ] **Authentication**: User accounts and secure login
- [ ] **Career Path Recommendations**: Suggest next career moves
- [ ] **Interview Preparation**: AI-powered mock interviews
- [ ] **Real-time Skill Tracking**: Progress monitoring dashboard
- [ ] **LinkedIn Integration**: Auto-sync profile data
- [ ] **Multiple Language Support**: International accessibility
- [ ] **API Rate Limiting**: Implement rate limits for production
- [ ] **Enhanced Caching**: Reduce OpenAI API costs
- [ ] **Mobile App**: Native iOS/Android versions

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and commit: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Follow PEP 8 for Python code
- Use Prettier for JavaScript formatting
- Write clear commit messages
- Include tests for new features
- Update README if needed

---

## 🙏 Acknowledgments

- Built with ❤️ using [React](https://react.dev/), [Flask](https://flask.palletsprojects.com/), and [OpenAI](https://openai.com/)
- Inspired by the need for better career development tools
- Thanks to all contributors and users


---

## 🎓 Learning Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## 📊 Project Stats

- **Language**: Python, JavaScript, HTML/CSS
- **Frontend Framework**: React
- **Backend Framework**: Flask
- **AI Model**: OpenAI GPT-4/3.5

---

