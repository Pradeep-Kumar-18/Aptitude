import { motion } from "framer-motion";

function QuestionCard({ question, currentIndex, total, selectedAnswer, onSelect }) {
  return (
    <motion.div 
      className="question-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="question-badge">
        Question {currentIndex + 1} <span style={{ color: "#94a3b8", fontWeight: "normal", margin: "0 4px" }}>of</span> {total}
      </div>
      <h2 className="question-text">{question.question}</h2>

      <div className="options-grid">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          return (
            <motion.label
              key={option}
              className={`option-card ${isSelected ? "selected" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.1 }}
              whileHover={{ scale: (isSelected || selectedAnswer) ? 1 : 1.01 }}
              whileTap={{ scale: selectedAnswer ? 1 : 0.99 }}
              style={{
                cursor: selectedAnswer ? "default" : "pointer",
                opacity: (selectedAnswer && !isSelected) ? 0.6 : 1
              }}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={isSelected}
                onChange={() => {
                  if (!selectedAnswer) {
                    onSelect(question.id, option);
                  }
                }}
                disabled={!!selectedAnswer}
                style={{ display: "none" }} // Hidden native input
              />
              
              <div className="option-radio-circle">
                <div className="option-radio-inner" />
              </div>
              
              <span className="option-text">{option}</span>
            </motion.label>
          );
        })}
      </div>
    </motion.div>
  );
}

export default QuestionCard;
