import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [skills, setSkills] = useState(null);
  const [targetRole, setTargetRole] = useState("AI/ML Engineer");
  const [gap, setGap] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setSkills(null);
    setGap(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setMessage("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error}`);
        return;
      }

      setSkills(data.skills);
      setMessage("✅ Skills extracted. Running gap analysis...");

      // Call gap analysis API
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
        setMessage("✅ Gap analysis completed!");
      } else {
        setMessage(`❌ ${gapData.error}`);
      }
    } catch (e) {
      setMessage("❌ Backend server not reachable.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>SkillBridge</h1>
      <p>OpenAI-powered Employability Analysis</p>

      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />

      <div style={{ marginTop: "10px" }}>
        <label>Target Job Role: </label>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. AI/ML Engineer"
        />
      </div>

      <button onClick={handleAnalyze} style={styles.button}>
        Analyze Resume
      </button>

      {message && <p>{message}</p>}

      {skills && (
        <div style={styles.box}>
          <h3>Extracted Skills</h3>
          <p><b>Technical:</b> {skills.technical_skills?.join(", ")}</p>
          <p><b>Soft:</b> {skills.soft_skills?.join(", ")}</p>
          <p><b>Tools:</b> {skills.tools?.join(", ")}</p>
        </div>
      )}

      {gap && (
        <div style={styles.box}>
          <h3>Skill Gap Analysis</h3>
          <p><b>Matched Skills:</b> {gap.matched_skills?.join(", ")}</p>
          <p><b>Missing Skills:</b> {gap.missing_skills?.join(", ")}</p>
          <p><b>Readiness Score:</b> {gap.readiness_score}%</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    fontFamily: "Arial",
    textAlign: "center",
  },
  button: {
    marginTop: "15px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  box: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "left",
  },
};

export default App;