import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle, CheckCircle2 } from "lucide-react";

const listVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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

  const instructions = [
    "The test contains 20 shuffled questions.",
    "You have 15 minutes to complete the test.",
    "Once you answer a question and move to the Next one, you cannot return to previous questions.",
    "Each question carries one mark.",
    "The test auto-submits when the timer reaches zero.",
    "After submission, your score will be calculated and the result page will be displayed."
  ];

  return (
    <div className="page-shell">
      <motion.div 
        className="content-card narrow-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.p 
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Instruction Page
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Read the instructions before starting
        </motion.h1>
        
        <motion.div 
          className="instruction-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p style={{ margin: 0, fontSize: "1.2rem", marginBottom: "8px" }}>
            <span className="muted">Hi </span>
            <strong style={{ color: "var(--primary)" }}>{student.name}</strong>,
          </p>
          
          <motion.ul variants={listVariants} initial="hidden" animate="visible">
            {instructions.map((text, idx) => (
              <motion.li key={idx} variants={itemVariants} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        
        <motion.div 
          className="btn-row between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button 
            className="secondary-btn" 
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={18} />
            Back to Edit
          </motion.button>
          
          <motion.button 
            className="primary-btn" 
            onClick={() => navigate("/test")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ fontWeight: "700", padding: "1rem 2rem" }}
          >
            Start Test
            <PlayCircle size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default InstructionPage;
