import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function InstructionPage() {
  const navigate = useNavigate();
  const student = useMemo(() => {
    const raw = localStorage.getItem("student");
    return raw ? JSON.parse(raw) : null;
  }, []);

  if (!student) {
    navigate("/");
    return null;
  }

  return (
    <div className="page-shell">
      <div className="content-card narrow-card">
        <p className="eyebrow">Instruction Page</p>
        <h1>Read the instructions before starting</h1>
        <div className="instruction-box">
          <p><strong>Candidate:</strong> {student.name}</p>
          <ul>
            <li>The test contains 20 shuffled questions.</li>
            <li>You have 15 minutes to complete the test.</li>
            <li>You can move between questions using Next, Previous, or the question palette.</li>
            <li>Each question carries one mark.</li>
            <li>The test auto-submits when the timer reaches zero.</li>
            <li>After submission, the backend calculates the score and returns the result page.</li>
          </ul>
        </div>
        <div className="btn-row">
          <button className="secondary-btn" onClick={() => navigate("/")}>Back</button>
          <button className="primary-btn" onClick={() => navigate("/test")}>Start Test</button>
        </div>
      </div>
    </div>
  );
}

export default InstructionPage;
