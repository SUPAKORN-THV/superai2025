import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["single-choice", "multiple-choice", "free-text", "code"],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [String], // For choice questions
  correctAnswer: mongoose.Schema.Types.Mixed, // String or Array
  explanation: String,
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  points: {
    type: Number,
    default: 1,
  },
  codeTemplate: String, // For code questions
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
})

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    language: {
      type: String,
      required: true,
      enum: ["javascript", "python", "java", "cpp", "html", "css", "sql"],
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    category: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
    timeLimit: {
      type: Number, // in minutes
      default: 30,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    totalPoints: Number,
    averageScore: Number,
    totalAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

quizSchema.pre("save", function (next) {
  this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0)
  next()
})

export default mongoose.model("Quiz", quizSchema)
