require("dotenv").config();
const express = require("express");
const cors = require("cors");
const questions = require("./questions");

const app = express();
const PORT = process.env.PORT || 5000;
const TOTAL_QUESTIONS = 20;
const GOOGLE_SCRIPT_URL = (process.env.GOOGLE_SCRIPT_URL || "").trim();

app.use(cors());
app.use(express.json());

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuestions() {
  return shuffleArray(questions)
    .slice(0, TOTAL_QUESTIONS)
    .map(({ answer, ...rest }) => rest);
}

function validateStudent(student = {}) {
  const requiredFields = ["name", "email", "phone"];
  return requiredFields.every((field) => String(student[field] || "").trim().length > 0);
}

function extractScriptResult(rawText) {
  const text = String(rawText || "").trim();

  if (!text) {
    throw new Error("Google Script returned an empty response.");
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed.success === true) {
      return { success: true, response: parsed };
    }

    if (
      parsed.result === "success" ||
      parsed.status === "success" ||
      parsed.message === "Success"
    ) {
      return { success: true, response: parsed };
    }

    throw new Error(parsed.error || parsed.message || "Google Sheet save failed.");
  } catch (jsonError) {
    const lower = text.toLowerCase();

    if (["success", "ok", "saved", "row added successfully"].includes(lower)) {
      return { success: true, response: { message: text } };
    }

    if (lower.includes("<html") || lower.includes("<!doctype html")) {
      throw new Error(
        "Google Script returned an HTML page. Check that the Web App is deployed correctly, access is set to Anyone, and the /exec URL is used in backend/.env."
      );
    }

    throw new Error(`Google Script returned unexpected response: ${text}`);
  }
}

async function saveToGoogleSheet(payload) {
  if (!GOOGLE_SCRIPT_URL) {
    return {
      skipped: true,
      success: false,
      reason: "GOOGLE_SCRIPT_URL not configured",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: controller.signal,
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Google Sheet request failed: ${response.status} ${text}`);
    }

    const result = extractScriptResult(text);

    return {
      skipped: false,
      success: true,
      response: result.response,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Google Sheet request timed out after 15 seconds.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

app.get("/", (req, res) => {
  res.send("Aptitude backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    port: String(PORT),
    googleSheetConfigured: Boolean(GOOGLE_SCRIPT_URL),
  });
});

app.get("/api/questions", (req, res) => {
  res.json(pickQuestions());
});

app.post("/api/submit", async (req, res) => {
  try {
    const { student, answers = {}, questionIds = [] } = req.body;

    if (!validateStudent(student)) {
      return res.status(400).json({ message: "Student details are incomplete." });
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: "Question list is missing." });
    }

    const usedQuestions = questionIds
      .map((id) => questions.find((question) => question.id === Number(id)))
      .filter(Boolean);

    if (usedQuestions.length === 0) {
      return res.status(400).json({ message: "No valid questions found for submission." });
    }

    let score = 0;
    const review = usedQuestions.map((question) => {
      const chosenAnswer = answers[String(question.id)] || "Not Answered";
      const isCorrect = chosenAnswer === question.answer;
      if (isCorrect) score += 1;

      return {
        id: question.id,
        question: question.question,
        chosenAnswer,
        correctAnswer: question.answer,
        isCorrect,
      };
    });

    const resultPayload = {
      name: student.name,
      email: student.email,
      phone: student.phone,
      qualification: student.qualification,
      city: student.city,
      town: student.town,
      experienceLevel: student.experienceLevel,
      college: student.college || "N/A",
      role: student.role || "N/A",
      score,
      total: usedQuestions.length,
      submittedAt: new Date().toISOString(),
    };

    let sheetStatus = {
      skipped: true,
      success: false,
      reason: "GOOGLE_SCRIPT_URL not configured",
    };

    try {
      sheetStatus = await saveToGoogleSheet(resultPayload);
    } catch (sheetError) {
      console.error("Google Sheet save failed:", sheetError.message);
      sheetStatus = {
        skipped: false,
        success: false,
        error: sheetError.message,
      };
    }

    return res.json({
      score,
      total: usedQuestions.length,
      percentage: Number(((score / usedQuestions.length) * 100).toFixed(2)),
      student,
      review,
      sheetStatus,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({ message: "Server error while submitting test." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
