import mongoose from "mongoose"

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userAnswer: mongoose.Schema.Types.Mixed,
  isCorrect: Boolean,
  pointsEarned: Number,
  timeSpent: Number, // in seconds
})

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number, // in seconds
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    feedback: {
      strengths: [String],
      improvements: [String],
      recommendations: [String],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("QuizAttempt", quizAttemptSchema)
