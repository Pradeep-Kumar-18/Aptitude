import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Send, AlertCircle, Loader2 } from "lucide-react";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";

const TEST_DURATION = 15 * 60;

function TestPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const hasSubmittedRef = useRef(false);

  const student = useMemo(() => {
    const raw = localStorage.getItem("student");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    if (!student) {
      navigate("/");
      return;
    }

    const fetchQuestions = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
        const response = await axios.get(`${API_BASE_URL}/api/questions`);
        setQuestions(response.data);
        localStorage.setItem(
          "questionIds",
          JSON.stringify(response.data.map((question) => question.id))
        );
      } catch (fetchError) {
        setError("Backend not running. Start backend first.");
      }
    };

    fetchQuestions();
  }, [navigate, student]);

  useEffect(() => {
    if (!questions.length || isSubmitting) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length, isSubmitting]);

  function handleSelect(questionId, option) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  async function submitTest(autoSubmit = false) {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      const questionIds = JSON.parse(localStorage.getItem("questionIds") || "[]");
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      const response = await axios.post(`${API_BASE_URL}/api/submit`, {
        student,
        answers,
        questionIds,
      });

      localStorage.setItem(
        "result",
        JSON.stringify({ ...response.data, autoSubmit })
      );
      navigate("/result");
    } catch (submitError) {
      console.error(submitError);
      setError("Submission failed. Please check backend and try again.");
      setIsSubmitting(false);
      hasSubmittedRef.current = false;
    }
  }

  if (!student) return null;

  if (error && questions.length === 0) {
    return (
      <div className="page-shell">
        <motion.div 
          className="content-card narrow-card center-text error-text"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle size={48} style={{ margin: "0 auto 16px" }} />
          <h2>{error}</h2>
          <p className="muted">Make sure backend is running on port 5000.</p>
          <button className="primary-btn mt-24" onClick={() => window.location.reload()} style={{ marginTop: "24px" }}>
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="page-shell" style={{ alignItems: "center", justifyContent: "center" }}>
        <motion.div 
          className="center-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ display: "inline-block", color: "var(--primary)", marginBottom: "16px" }}
          >
            <Loader2 size={40} />
          </motion.div>
          <h2>Preparing your test...</h2>
          <p className="muted">Good luck, {student.name}!</p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="page-shell">
      <motion.div 
        className="test-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <aside className="sidebar-card">
          <div>
            <p className="eyebrow">Candidate</p>
            <h3 style={{ margin: "4px 0" }}>{student.name}</h3>
            <p className="muted small-text" style={{ margin: 0 }}>
              {student.qualification} - {student.experienceLevel}
            </p>
          </div>

          <Timer timeLeft={timeLeft} />

          <div className="summary-box">
            <div className="summary-card accent">
              <span>Answered</span>
              <strong>{answeredCount}/{questions.length}</strong>
            </div>
            <div className="summary-card">
              <span>Remaining</span>
              <strong>{questions.length - answeredCount}</strong>
            </div>
          </div>
        </aside>

        <section className="main-panel">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion.id} // Important for triggering unmount/mount animations
              question={currentQuestion}
              currentIndex={currentIndex}
              total={questions.length}
              selectedAnswer={answers[currentQuestion.id] || ""}
              onSelect={handleSelect}
            />
          </AnimatePresence>

          {error && (
            <motion.div 
              className="error-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={18} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
              {error}
            </motion.div>
          )}

          <div className="btn-row between">
            <div /> {/* Spacer to keep Next button on the right */}

            <div className="btn-row">
              {currentIndex < questions.length - 1 ? (
                <button
                  className="primary-btn"
                  type="button"
                  disabled={!answers[currentQuestion.id]}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  className="primary-btn"
                  type="button"
                  disabled={isSubmitting || !answers[currentQuestion.id]}
                  onClick={() => submitTest(false)}
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Test"}
                  {!isSubmitting && <Send size={18} />}
                </button>
              )}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

export default TestPage;
