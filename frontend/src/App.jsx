import { Navigate, Route, Routes } from "react-router-dom";
import RegisterForm from "./pages/RegisterForm";
import InstructionPage from "./pages/InstructionPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterForm />} />
      <Route path="/instructions" element={<InstructionPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
