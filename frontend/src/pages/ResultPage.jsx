import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const navigate = useNavigate();
  const result = useMemo(() => {
    const raw = localStorage.getItem("result");
    return raw ? JSON.parse(raw) : null;
  }, []);

  if (!result) {
    navigate("/");
    return null;
  }

  const { score, total, percentage, student, sheetStatus, autoSubmit } = result;


  const isSuccess = percentage >= 70;

  return (
    <div className="page-shell flex-center">
      <div className="content-card narrow-card center-text result-card-mobile animate-up">
        <div className={`status-icon-ring animate-pop ${isSuccess ? 'success' : 'warning'}`}>
          {isSuccess ? '🏆' : '🎯'}
        </div>
        <p className="eyebrow">{isSuccess ? "Great Job!" : "Test Completed"}</p>
        <h1 className="result-name">{student.name}</h1>

        <div className="score-ring polished-ring animate-pop delay-1">
          <div className="score-ring-inner">
            <span className="score-percent">{percentage}%</span>
            <span className="score-label">Score</span>
          </div>
        </div>

        <div className="result-stats animate-up delay-2">
          <p className="muted score-line">
            Correct Answers: <strong>{score}</strong> out of {total}
          </p>
          {autoSubmit ? <p className="warning-text auto-submit-warn">⚠️ Time ended. The test was auto-submitted.</p> : null}
        </div>

        <div className="result-grid polished-grid animate-up delay-3">
          <div className="result-box polished-box">
            <span>College</span>
            <strong>{student.college}</strong>
          </div>
          <div className="result-box polished-box">
            <span>Department</span>
            <strong>{student.department}</strong>
          </div>
        </div>

        <div className="btn-row center full-mobile-btn-row animate-fade delay-4 mt-24">
          <button className="primary-btn wide-mobile-btn" onClick={() => navigate("/")}>Take Another Test</button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
