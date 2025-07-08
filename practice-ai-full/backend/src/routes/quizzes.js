import express from "express"
import { body, validationResult } from "express-validator"
import Quiz from "../models/Quiz.js"
import QuizAttempt from "../models/QuizAttempt.js"
import User from "../models/User.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Get all quizzes
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, language, difficulty, category } = req.query

    const filter = { isPublic: true }
    if (language) filter.language = language
    if (difficulty) filter.difficulty = difficulty
    if (category) filter.category = new RegExp(category, "i")

    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-questions.correctAnswer -questions.explanation")

    const total = await Quiz.countDocuments(filter)

    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get quizzes error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get quiz by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("createdBy", "username")

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    // Don't send correct answers and explanations when fetching for taking
    const quizForTaking = {
      ...quiz.toObject(),
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        type: q.type,
        question: q.question,
        options: q.options,
        difficulty: q.difficulty,
        points: q.points,
        codeTemplate: q.codeTemplate,
      })),
    }

    res.json(quizForTaking)
  } catch (error) {
    console.error("Get quiz error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new quiz
router.post(
  "/",
  auth,
  [
    body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
    body("language").isIn(["javascript", "python", "java", "cpp", "html", "css", "sql"]),
    body("difficulty").isIn(["beginner", "intermediate", "advanced"]),
    body("questions").isArray({ min: 1 }).withMessage("At least one question is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const quizData = {
        ...req.body,
        createdBy: req.userId,
      }

      const quiz = new Quiz(quizData)
      await quiz.save()

      res.status(201).json(quiz)
    } catch (error) {
      console.error("Create quiz error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Submit quiz attempt
router.post("/:id/attempt", auth, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    // Calculate score
    let score = 0
    const processedAnswers = []

    for (let i = 0; i < answers.length; i++) {
      const userAnswer = answers[i]
      const question = quiz.questions.find((q) => q._id.toString() === userAnswer.questionId)

      if (!question) continue

      let isCorrect = false
      let pointsEarned = 0

      // Check answer based on question type
      if (question.type === "single-choice") {
        isCorrect = userAnswer.answer === question.correctAnswer
      } else if (question.type === "multiple-choice") {
        const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer]
        const userAnswers = Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer]
        isCorrect =
          correctAnswers.length === userAnswers.length && correctAnswers.every((ans) => userAnswers.includes(ans))
      } else if (question.type === "free-text") {
        isCorrect = userAnswer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
      }
      // Code questions would need special handling with the sandbox

      if (isCorrect) {
        pointsEarned = question.points
        score += pointsEarned
      }

      processedAnswers.push({
        questionId: question._id,
        userAnswer: userAnswer.answer,
        isCorrect,
        pointsEarned,
        timeSpent: userAnswer.timeSpent || 0,
      })
    }

    const percentage = Math.round((score / quiz.totalPoints) * 100)

    // Create quiz attempt
    const attempt = new QuizAttempt({
      user: req.userId,
      quiz: quiz._id,
      answers: processedAnswers,
      score,
      totalPoints: quiz.totalPoints,
      percentage,
      timeSpent,
    })

    await attempt.save()

    // Update user stats
    const user = await User.findById(req.userId)
    user.stats.totalQuizzes += 1
    user.stats.totalTimeSpent += timeSpent
    user.stats.averageScore = Math.round(
      (user.stats.averageScore * (user.stats.totalQuizzes - 1) + percentage) / user.stats.totalQuizzes,
    )
    user.stats.lastQuizDate = new Date()

    await user.save()

    // Update quiz stats
    quiz.totalAttempts += 1
    quiz.averageScore = Math.round((quiz.averageScore * (quiz.totalAttempts - 1) + percentage) / quiz.totalAttempts)
    await quiz.save()

    // Return detailed results
    const detailedResults = {
      attempt: attempt._id,
      score,
      totalPoints: quiz.totalPoints,
      percentage,
      timeSpent,
      results: processedAnswers.map((answer, index) => {
        const question = quiz.questions.find((q) => q._id.toString() === answer.questionId)
        return {
          question: question.question,
          userAnswer: answer.userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: answer.isCorrect,
          explanation: question.explanation,
          pointsEarned: answer.pointsEarned,
          totalPoints: question.points,
        }
      }),
    }

    res.json(detailedResults)
  } catch (error) {
    console.error("Submit attempt error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get quiz attempts for a user
router.get("/:id/attempts", auth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      quiz: req.params.id,
      user: req.userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)

    res.json(attempts)
  } catch (error) {
    console.error("Get attempts error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
