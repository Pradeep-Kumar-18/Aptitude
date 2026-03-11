import { Clock } from "lucide-react";

function Timer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isWarning = timeLeft <= 60 && timeLeft > 0; // Last 1 minute warning

  return (
    <div className={`timer-chip ${isWarning ? "warning" : ""}`}>
      <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "500" }}>
        <Clock size={18} />
        {isWarning ? "Time Running Out!" : "Time Left"}
      </span>
      <strong style={{ fontSize: "1.4rem", fontFamily: "monospace", letterSpacing: "1px" }}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </strong>
    </div>
  );
}

export default Timer;
