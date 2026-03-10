import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  college: "",
  department: "",
  location: "",
};

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("student");
    return saved ? JSON.parse(saved) : initialForm;
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
      <div className="hero-card register-layout">
        <div>
          <p className="eyebrow">Professional Aptitude Assessment</p>
          <h1>Register to start your aptitude test</h1>
          <p className="muted">
            Fill in your details carefully. Your score, student information, and location will be saved to
            Google Sheets after submission.
          </p>
          <div className="info-list">
            <div>✔ Student registration</div>
            <div>✔ Location tracking</div>
            <div>✔ Timed test</div>
            <div>✔ Question navigation</div>
            <div>✔ Result summary</div>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Student Details</h2>
          <div className="form-grid two-col-grid">
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            <input name="college" placeholder="College Name" value={form.college} onChange={handleChange} required />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
            <input name="location" placeholder="City or Town" value={form.location || ""} onChange={handleChange} required />
          </div>
          <button className="primary-btn wide-mobile-btn" type="submit">
            Continue to Instructions
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
