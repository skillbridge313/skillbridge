import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [skills, setSkills] = useState(null);
  const [targetRole, setTargetRole] = useState("AI/ML Engineer");
  const [gap, setGap] = useState(null);
  const [courses, setCourses] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setSkills(null);
    setGap(null);
    setCourses(null);
    setPlan(null);
  };

  const setStatusMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
  };

  // ---------------------------
  // Resume Analysis
  // ---------------------------
  const handleAnalyze = async () => {
    if (!file) {
      setStatusMessage("Please select a resume file first.", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMessage(data.error, "error");
        setLoading(false);
        return;
      }

      setSkills(data.skills);
      setStatusMessage("✨ Skills extracted successfully!", "success");

      const gapRes = await fetch("http://127.0.0.1:5000/analyze-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: data.skills,
          target_role: targetRole,
        }),
      });

      const gapData = await gapRes.json();

      if (gapRes.ok) {
        setGap(gapData.gap_analysis);
        setStatusMessage("🎯 Gap analysis completed!", "success");
        setActiveTab("gap");
      } else {
        setStatusMessage(gapData.error, "error");
      }
    } catch (e) {
      setStatusMessage("⚠️ Backend server not reachable.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Course Recommendations
  // ---------------------------
  const handleCourses = async () => {
    if (!gap) return;

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/recommend-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          missing_skills: gap.missing_skills,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCourses(data.courses);
        setActiveTab("courses");
        setStatusMessage("📚 Course recommendations loaded!", "success");
      } else {
        setStatusMessage(data.error, "error");
      }
    } catch {
      setStatusMessage("Failed to fetch course recommendations", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Learning Plan
  // ---------------------------
  const handlePlan = async () => {
    if (!gap) return;

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          missing_skills: gap.missing_skills,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPlan(data.learning_plan);
        setActiveTab("plan");
        setStatusMessage("📋 Learning plan generated!", "success");
      } else {
        setStatusMessage(data.error, "error");
      }
    } catch {
      setStatusMessage("Failed to generate learning plan", "error");
    } finally {
      setLoading(false);
    }
  };

  const SkillBadge = ({ skill }) => (
    <span className="skill-badge">{skill}</span>
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🌉</div>
            <div>
              <h1 className="app-title">SkillBridge</h1>
              <p className="app-subtitle">
                AI-Powered Career Readiness Analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Upload Section */}
        <section className="upload-section">
          <div className="upload-card">
            <h2>Upload Your Resume</h2>
            <div className="upload-box">
              <input
                type="file"
                id="file-input"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="file-input" className="file-label">
                <span className="upload-icon">📄</span>
                <span className="upload-text">
                  {file ? file.name : "Click to upload or drag and drop"}
                </span>
                <span className="upload-hint">PDF or DOCX files accepted</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="target-role">Target Job Role</label>
              <input
                id="target-role"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="input-field"
                placeholder="e.g., AI/ML Engineer, Data Scientist, Full-Stack Developer"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="btn-primary btn-large"
            >
              {loading ? "Analyzing..." : "🚀 Analyze Resume"}
            </button>
          </div>
        </section>

        {/* Messages */}
        {message && (
          <div className={`message message-${messageType}`}>{message}</div>
        )}

        {/* Results Section */}
        {(skills || gap || courses || plan) && (
          <section className="results-section">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "skills" ? "active" : ""}`}
                onClick={() => setActiveTab("skills")}
              >
                Skills
              </button>
              {gap && (
                <button
                  className={`tab ${activeTab === "gap" ? "active" : ""}`}
                  onClick={() => setActiveTab("gap")}
                >
                  Gap Analysis
                </button>
              )}
              {courses && (
                <button
                  className={`tab ${activeTab === "courses" ? "active" : ""}`}
                  onClick={() => setActiveTab("courses")}
                >
                  Courses
                </button>
              )}
              {plan && (
                <button
                  className={`tab ${activeTab === "plan" ? "active" : ""}`}
                  onClick={() => setActiveTab("plan")}
                >
                  Learning Plan
                </button>
              )}
            </div>

            {/* Skills Tab */}
            {activeTab === "skills" && skills && (
              <div className="result-card">
                <h3 className="result-title">Extracted Skills</h3>
                <div className="skills-container">
                  {skills.technical_skills && (
                    <div className="skill-group">
                      <h4 className="skill-category">Technical Skills</h4>
                      <div className="skill-list">
                        {skills.technical_skills.map((skill, i) => (
                          <SkillBadge key={i} skill={skill} />
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.soft_skills && (
                    <div className="skill-group">
                      <h4 className="skill-category">Soft Skills</h4>
                      <div className="skill-list">
                        {skills.soft_skills.map((skill, i) => (
                          <SkillBadge key={i} skill={skill} />
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.tools && (
                    <div className="skill-group">
                      <h4 className="skill-category">Tools & Technologies</h4>
                      <div className="skill-list">
                        {skills.tools.map((tool, i) => (
                          <SkillBadge key={i} skill={tool} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gap Analysis Tab */}
            {activeTab === "gap" && gap && (
              <div className="result-card">
                <h3 className="result-title">Skill Gap Analysis</h3>

                <div className="readiness-score-container">
                  <div className="readiness-circle">
                    <span className="readiness-value">
                      {gap.readiness_score}%
                    </span>
                  </div>
                  <p className="readiness-label">Readiness Score</p>
                </div>

                <div className="gap-analysis-grid">
                  <div className="gap-item">
                    <h4 className="gap-title">Matched Skills</h4>
                    <div className="gap-list">
                      {gap.matched_skills && gap.matched_skills.length > 0 ? (
                        gap.matched_skills.map((skill, i) => (
                          <div key={i} className="gap-skill matched">
                            ✓ {skill}
                          </div>
                        ))
                      ) : (
                        <p className="empty-state">No matched skills yet</p>
                      )}
                    </div>
                  </div>

                  <div className="gap-item">
                    <h4 className="gap-title">Missing Skills</h4>
                    <div className="gap-list">
                      {gap.missing_skills && gap.missing_skills.length > 0 ? (
                        gap.missing_skills.map((skill, i) => (
                          <div key={i} className="gap-skill missing">
                            ⚠ {skill}
                          </div>
                        ))
                      ) : (
                        <p className="empty-state">All skills matched!</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={handleCourses}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    {loading ? "Loading..." : "📚 Recommend Courses"}
                  </button>
                  <button
                    onClick={handlePlan}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    {loading ? "Generating..." : "📋 Generate Learning Plan"}
                  </button>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && courses && (
              <div className="result-card">
                <h3 className="result-title">Recommended Courses</h3>
                <div className="courses-container">
                  {courses.courses &&
                    courses.courses.map((courseGroup, i) => (
                      <div key={i} className="course-group">
                        <h4 className="course-skill">{courseGroup.skill}</h4>
                        <ul className="course-list">
                          {courseGroup.recommended_courses.map(
                            (course, j) => (
                              <li key={j} className="course-item">
                                {course}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Learning Plan Tab */}
            {activeTab === "plan" && plan && (
              <div className="result-card">
                <h3 className="result-title">Personalized Learning Plan</h3>
                <div className="learning-plan-content">
                  <ReactMarkdown>{plan}</ReactMarkdown>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          SkillBridge © 2024 • Powered by OpenAI • Your path to career success
        </p>
      </footer>
    </div>
  );
}

export default App;