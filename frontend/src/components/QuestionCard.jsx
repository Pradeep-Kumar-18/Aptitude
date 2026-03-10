function QuestionCard({ question, currentIndex, total, selectedAnswer, onSelect }) {
  return (
    <div className="question-card">
      <div className="question-badge">Question {currentIndex + 1} of {total}</div>
      <h2>{question.question}</h2>

      <div className="options-grid">
        {question.options.map((option) => (
          <label
            key={option}
            className={`option-card ${selectedAnswer === option ? "selected" : ""}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedAnswer === option}
              onChange={() => onSelect(question.id, option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
