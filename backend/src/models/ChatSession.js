import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      url: String,
      extractedText: String,
    },
  ],
})

const chatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat Session",
    },
    messages: [messageSchema],
    context: {
      topic: String,
      language: String,
      difficulty: String,
      extractedContent: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    generatedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("ChatSession", chatSessionSchema)
