import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        <div className="content-card narrow-card center-text">
          <h2>{error}</h2>
          <p className="muted">Make sure backend is running on port 5000.</p>
          <button className="primary-btn" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="page-shell">
        <div className="content-card narrow-card center-text">
          <h2>Loading questions...</h2>
          <p className="muted">Please wait while the test is being prepared.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="page-shell">
      <div className="test-layout">
        <aside className="sidebar-card">
          <div>
            <p className="eyebrow">Candidate</p>
            <h3>{student.name}</h3>
            <p className="muted small-text">{student.college}</p>
          </div>

          <Timer timeLeft={timeLeft} />

          <div className="summary-box">
            <div>
              <span>Answered</span>
              <strong>{answeredCount}/{questions.length}</strong>
            </div>
            <div>
              <span>Unanswered</span>
              <strong>{questions.length - answeredCount}</strong>
            </div>
          </div>

          <div>
            <p className="palette-title">Question Palette</p>
            <div className="palette-grid">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  type="button"
                  className={`palette-btn ${currentIndex === index ? "active" : ""} ${answers[question.id] ? "answered" : ""}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="main-panel">
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            total={questions.length}
            selectedAnswer={answers[currentQuestion.id] || ""}
            onSelect={handleSelect}
          />

          {error ? <p className="error-text">{error}</p> : null}

          <div className="btn-row between">
            <button
              className="secondary-btn"
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
            >
              Previous
            </button>

            <div className="btn-row">
              {currentIndex < questions.length - 1 ? (
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                >
                  Submit
                </button>
              ) : (
                <button
                  className="primary-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => submitTest(false)}
                >
                  {isSubmitting ? "Submitting..." : "Submit Test"}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TestPage;
