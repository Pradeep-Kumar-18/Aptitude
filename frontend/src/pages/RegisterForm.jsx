import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCheck, MapPin, Clock, Navigation, BarChart3, ChevronRight } from "lucide-react";

const initialForm = {
  name: "",
  dob: "",
  email: "",
  phone: "",
  qualification: "",
  city: "",
  town: "",
  experienceLevel: "Fresher",
  college: "",
  passedOutYear: "",
  yearsOfExperience: "",
  role: "",
};

const infoItems = [
  { icon: UserCheck, text: "Registration" },
  { icon: Clock, text: "Timed test (15 mins)" },
  { icon: Navigation, text: "Question navigation" },
  { icon: BarChart3, text: "Result summary" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("student");
    return saved ? { ...initialForm, ...JSON.parse(saved) } : initialForm;
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    localStorage.setItem("student", JSON.stringify(form));
    localStorage.removeItem("result");
    localStorage.removeItem("questionIds");
    navigate("/instructions");
  }

  return (
    <div className="page-shell">
      <motion.div
        className="hero-card register-layout"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div>
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Professional Aptitude Assessment
          </motion.p>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            Start your aptitude test
          </motion.h1>
          <motion.p className="muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Please fill in your details accurately to proceed. Ensure all information is correct as it will be used for your assessment record.
          </motion.p>

          <motion.div
            className="info-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {infoItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={idx} className="info-item" variants={itemVariants}>
                  <div className="icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <span>{item.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.form
          className="form-card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <h2>Candidate Details</h2>
          <div className="form-grid">
            <div className="input-container full-span">
              <label className="input-label">Full Name</label>
              <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>

            <div className="input-container">
              <label className="input-label">Date of Birth</label>
              <input
                name="dob"
                type="date"
                min="1950-01-01"
                max={new Date().toISOString().split("T")[0]}
                value={form.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-container">
              <label className="input-label">Phone Number</label>
              <input name="phone" placeholder="123-456-7890" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="input-container">
              <label className="input-label">Email Address</label>
              <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="input-container">
              <label className="input-label">Qualification</label>
              <input name="qualification" placeholder="ex: B.Tech, B.Sc" value={form.qualification} onChange={handleChange} required />
            </div>

            <div className="input-container">
              <label className="input-label">City</label>
              <input name="city" placeholder="e.g. Chennai" value={form.city} onChange={handleChange} required />
            </div>

            <div className="input-container">
              <label className="input-label">Town</label>
              <input name="town" placeholder="e.g. Tambaram" value={form.town} onChange={handleChange} required />
            </div>

            <div className="input-container full-span">
              <label className="input-label">Experience Level</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} required>
                <option value="Fresher">Fresher</option>
                <option value="Experience">Experience</option>
              </select>
            </div>

            {form.experienceLevel === "Experience" ? (
              <>
                <div className="input-container">
                  <label className="input-label">Years of Experience</label>
                  <input name="yearsOfExperience" type="number" min="1" placeholder="e.g. 2" value={form.yearsOfExperience} onChange={handleChange} required />
                </div>
                <div className="input-container">
                  <label className="input-label">Role</label>
                  <input name="role" placeholder="Software Engineer" value={form.role} onChange={handleChange} required />
                </div>
              </>
            ) : (
              <>
                <div className="input-container">
                  <label className="input-label">College Name</label>
                  <input name="college" placeholder="University of Technology" value={form.college} onChange={handleChange} required />
                </div>
                <div className="input-container">
                  <label className="input-label">Year of Passed Out</label>
                  <input name="passedOutYear" type="number" placeholder="e.g. 2024" value={form.passedOutYear} onChange={handleChange} required />
                </div>
              </>
            )}
          </div>

          <motion.button
            className="primary-btn wide-mobile-btn"
            type="submit"
            style={{ width: "100%", marginTop: "16px" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Instructions
            <ChevronRight size={18} />
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default RegisterForm;
