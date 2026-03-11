import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle2, XCircle, Award } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const COLORS = {
  correct: "#22c55e", // Green
  wrong: "#ef4444",   // Red
  skipped: "#94a3b8", // Gray
  unanswered: "#60a5fa" // Light Blue
};

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

  const { score, total, percentage, student, autoSubmit } = result;

  // Assuming missing data for 'skipped' if not sent from backend, calculating wrongs properly.
  // We deduce unanswered if there's tracking for it, else just correct vs wrong.
  const correct = score;
  const unanswered = 0; // Replace with actual value if backend sends it.
  const wrong = total - correct - unanswered;  
  const skipped = 0; // The UI doesn't allow skipping right now, so this is 0.

  const chartData = [
    { name: "Correct", value: correct, color: COLORS.correct },
    { name: "Wrong", value: wrong, color: COLORS.wrong },
  ].filter(item => item.value > 0);

  return (
    <div className="page-shell flex-center">
      <motion.div 
        className="content-card narrow-card result-card-mobile"
        style={{ paddingTop: "24px" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="result-name" style={{ margin: "0 0 16px", fontSize: "2.5rem" }}>
            Test Results
          </h1>
          <hr style={{ border: "none", borderBottom: "1px solid #e2e8f0", marginBottom: "32px", width: "100%" }} />
        </motion.div>

        <motion.div className="chart-section" variants={itemVariants}>
          <div style={{ width: 220, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} questions`, name]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="custom-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ background: COLORS.correct }}></div>
              Correct ({Math.round((correct / total) * 100)}%)
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: COLORS.wrong }}></div>
              Wrong ({Math.round((wrong / total) * 100)}%)
            </div>
            {skipped > 0 && (
              <div className="legend-item">
                <div className="legend-color" style={{ background: COLORS.skipped }}></div>
                Skipped ({Math.round((skipped / total) * 100)}%)
              </div>
            )}
            {unanswered > 0 && (
              <div className="legend-item">
                <div className="legend-color" style={{ background: COLORS.unanswered }}></div>
                Unanswered ({Math.round((unanswered / total) * 100)}%)
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 style={{ fontSize: "2rem", marginBottom: "24px", textAlign: "center" }}>
            <u style={{ textDecorationColor: "var(--primary)", textDecorationThickness: "3px", textUnderlineOffset: "8px" }}>
              Score: {percentage}%
            </u>
          </h2>
        </motion.div>

        <motion.div className="detailed-stats-grid" variants={itemVariants}>
          <div className="stat-row">
            <span className="stat-label">Correct Answers:</span>
            <span className="stat-value" style={{ color: COLORS.correct }}>{correct}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Wrong Answers:</span>
            <span className="stat-value" style={{ color: COLORS.wrong }}>{wrong}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Unanswered:</span>
            <span className="stat-value">{unanswered}</span>
          </div>
          <div className="stat-row" style={{ paddingLeft: "24px", fontSize: "0.95rem" }}>
            <span className="stat-label" style={{ fontWeight: 500 }}>Skipped:</span>
            <span className="stat-value" style={{ fontWeight: 500 }}>{skipped}</span>
          </div>
          {autoSubmit ? (
             <div className="stat-row" style={{ paddingLeft: "24px", fontSize: "0.95rem" }}>
               <span className="stat-label" style={{ fontWeight: 500 }}>Out of time:</span>
               <span className="stat-value" style={{ fontWeight: 500, color: COLORS.wrong }}>Yes</span>
             </div>
          ) : null}
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginBottom: "40px" }}>
          <div className="result-box" style={{ padding: "32px", background: "rgba(0,0,0,0.2)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}>
              <Award size={18} /> Final Status
            </span>
            <strong style={{ 
              fontSize: "2.5rem", 
              marginTop: "12px",
              color: percentage >= 50 ? "#4ade80" : "#f87171",
              textShadow: percentage >= 50 ? "0 0 20px rgba(74, 222, 128, 0.4)" : "0 0 20px rgba(248, 113, 113, 0.4)"
            }}>
              {percentage >= 50 ? "PASS" : "FAIL"}
            </strong>
          </div>
        </motion.div>

        <motion.div 
          className="btn-row center" 
          variants={itemVariants}
          style={{ marginTop: "32px", paddingBottom: "24px" }}
        >
          <motion.button 
            className="primary-btn" 
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ width: "100%", maxWidth: "300px" }}
          >
            <RefreshCw size={18} />
            Take Another Assessment
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ResultPage;
