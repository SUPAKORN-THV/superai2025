import express from "express"
import User from "../models/User.js"
import Quiz from "../models/Quiz.js"
import QuizAttempt from "../models/QuizAttempt.js"
import { adminAuth } from "../middleware/auth.js"

const router = express.Router()

// Get admin dashboard stats
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalQuizzes = await Quiz.countDocuments()
    const totalAttempts = await QuizAttempt.countDocuments()

    const recentUsers = await User.find().select("username email createdAt stats").sort({ createdAt: -1 }).limit(10)

    const popularQuizzes = await Quiz.find()
      .select("title language totalAttempts averageScore")
      .sort({ totalAttempts: -1 })
      .limit(10)

    const languageStats = await Quiz.aggregate([
      {
        $group: {
          _id: "$language",
          count: { $sum: 1 },
          totalAttempts: { $sum: "$totalAttempts" },
        },
      },
      { $sort: { count: -1 } },
    ])

    res.json({
      totalUsers,
      totalQuizzes,
      totalAttempts,
      recentUsers,
      popularQuizzes,
      languageStats,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query

    const filter = {}
    if (search) {
      filter.$or = [{ username: new RegExp(search, "i") }, { email: new RegExp(search, "i") }]
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(filter)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user role
router.put("/users/:id/role", adminAuth, async (req, res) => {
  try {
    const { role } = req.body

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Update user role error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete user
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Also delete user's quiz attempts
    await QuizAttempt.deleteMany({ user: req.params.id })

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all quizzes for admin
router.get("/quizzes", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query

    const filter = {}
    if (search) {
      filter.title = new RegExp(search, "i")
    }

    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Quiz.countDocuments(filter)

    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get admin quizzes error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete quiz
router.delete("/quizzes/:id", adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id)

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    // Also delete quiz attempts
    await QuizAttempt.deleteMany({ quiz: req.params.id })

    res.json({ message: "Quiz deleted successfully" })
  } catch (error) {
    console.error("Delete quiz error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
