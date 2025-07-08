import express from "express"
import { body, validationResult } from "express-validator"
import User from "../models/User.js"
import QuizAttempt from "../models/QuizAttempt.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put(
  "/profile",
  auth,
  [
    body("profile.firstName").optional().trim(),
    body("profile.lastName").optional().trim(),
    body("profile.bio").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const user = await User.findById(req.userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Update profile fields
      if (req.body.profile) {
        user.profile = { ...user.profile, ...req.body.profile }
      }

      await user.save()

      res.json(user.profile)
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user's quiz attempts
router.get("/quiz-attempts", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const attempts = await QuizAttempt.find({ user: req.userId })
      .populate("quiz", "title language difficulty category")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await QuizAttempt.countDocuments({ user: req.userId })

    res.json({
      attempts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get quiz attempts error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user statistics
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("stats")

    // Get additional stats
    const recentAttempts = await QuizAttempt.find({ user: req.userId })
      .populate("quiz", "title language")
      .sort({ createdAt: -1 })
      .limit(5)

    const languageStats = await QuizAttempt.aggregate([
      { $match: { user: user._id } },
      {
        $lookup: {
          from: "quizzes",
          localField: "quiz",
          foreignField: "_id",
          as: "quizData",
        },
      },
      { $unwind: "$quizData" },
      {
        $group: {
          _id: "$quizData.language",
          count: { $sum: 1 },
          averageScore: { $avg: "$percentage" },
        },
      },
    ])

    res.json({
      ...user.stats,
      recentAttempts,
      languageStats,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
