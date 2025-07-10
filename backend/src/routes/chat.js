import express from "express"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import { auth } from "../middleware/auth.js"
import ChatSession from "../models/ChatSession.js"
import { FileProcessor } from "../services/fileProcessor.js"
import { AIChatService } from "../services/aiChatService.js"

const router = express.Router()

// Initialize AI Chat Service
let aiChatService
try {
  aiChatService = new AIChatService()
  console.log("✅ AI Chat Service initialized")
} catch (error) {
  console.error("❌ Failed to initialize AI Chat Service:", error.message)
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    try {
      FileProcessor.validateFile(file)
      cb(null, true)
    } catch (error) {
      cb(error, false)
    }
  },
})

// Create new chat session
router.post("/sessions", auth, async (req, res) => {
  try {
    const { title, context } = req.body

    const chatSession = new ChatSession({
      user: req.userId,
      title: title || "New Chat Session",
      context: context || {},
    })

    await chatSession.save()
    console.log(`✅ Created chat session: ${chatSession._id}`)

    res.status(201).json(chatSession)
  } catch (error) {
    console.error("Create chat session error:", error)
    res.status(500).json({ message: "Failed to create chat session" })
  }
})

// Get user's chat sessions
router.get("/sessions", auth, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.userId })
      .sort({ updatedAt: -1 })
      .select("title createdAt updatedAt isActive messages")
      .limit(20)

    const sessionsWithPreview = sessions.map((session) => ({
      ...session.toObject(),
      lastMessage:
        session.messages.length > 0
          ? session.messages[session.messages.length - 1].content.substring(0, 100)
          : "No messages yet",
      messageCount: session.messages.length,
    }))

    res.json(sessionsWithPreview)
  } catch (error) {
    console.error("Get chat sessions error:", error)
    res.status(500).json({ message: "Failed to fetch chat sessions" })
  }
})

// Get specific chat session
router.get("/sessions/:id", auth, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!session) {
      return res.status(404).json({ message: "Chat session not found" })
    }

    res.json(session)
  } catch (error) {
    console.error("Get chat session error:", error)
    res.status(500).json({ message: "Failed to fetch chat session" })
  }
})

// Send message with optional file upload
router.post("/sessions/:id/messages", auth, upload.array("files", 5), async (req, res) => {
  try {
    if (!aiChatService) {
      return res.status(500).json({
        message: "AI service is not available. Please check server configuration.",
      })
    }

    const { message, context } = req.body
    const files = req.files || []

    const session = await ChatSession.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!session) {
      return res.status(404).json({ message: "Chat session not found" })
    }

    console.log(`💬 Processing message for session ${req.params.id}`)

    // Process uploaded files
    const attachments = []
    let extractedContent = ""

    for (const file of files) {
      try {
        console.log(`📄 Processing file: ${file.originalname}`)
        const processedFile = await FileProcessor.processFile(file)
        attachments.push(processedFile)
        extractedContent += `\n\n--- ${processedFile.filename} ---\n${processedFile.extractedText}`
        console.log(`✅ Processed file: ${file.originalname} (${processedFile.extractedText.length} chars)`)
      } catch (error) {
        console.error(`❌ File processing error for ${file.originalname}:`, error)
        // Continue with other files
      }
    }

    // Update session context with extracted content
    if (extractedContent) {
      session.context.extractedContent = (session.context.extractedContent || "") + extractedContent
      console.log(`📝 Updated session context with ${extractedContent.length} characters`)
    }

    // Add user message
    const userMessage = {
      role: "user",
      content: message,
      attachments,
      timestamp: new Date(),
    }

    session.messages.push(userMessage)

    // Generate AI response
    console.log("🤖 Generating AI response...")
    const aiResponse = await aiChatService.generateResponse(session.messages, {
      ...session.context,
      ...JSON.parse(context || "{}"),
    })

    // Add AI response
    const assistantMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    }

    session.messages.push(assistantMessage)
    session.updatedAt = new Date()

    await session.save()

    console.log(`✅ Message exchange completed for session ${req.params.id}`)

    res.json({
      userMessage,
      assistantMessage,
      session: {
        id: session._id,
        context: session.context,
      },
    })
  } catch (error) {
    console.error("Send message error:", error)
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    })
  }
})

// Generate quiz from chat content
router.post("/sessions/:id/generate-quiz", auth, async (req, res) => {
  try {
    if (!aiChatService) {
      return res.status(500).json({
        success: false,
        message: "AI service is not available",
      })
    }

    const { options } = req.body

    const session = await ChatSession.findOne({
      _id: req.params.id,
      user: req.userId,
    })

    if (!session) {
      return res.status(404).json({ message: "Chat session not found" })
    }

    // Build content from chat messages if no extracted content
    let contentForQuiz = session.context.extractedContent || ''
    
    if (!contentForQuiz) {
      // Use both user and assistant messages to preserve full context
      contentForQuiz = session.messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n')
      
      if (!contentForQuiz || contentForQuiz.length < 50) {
        return res.status(400).json({
          success: false,
          message: "Not enough conversation content for quiz generation. Please have a longer conversation first.",
        })
      }
    }
    
    // Detect language from content
    const detectLanguage = (text) => {
      const thaiPattern = /[\u0E00-\u0E7F]/
      const chinesePattern = /[\u4E00-\u9FFF]/
      const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF]/
      
      if (thaiPattern.test(text)) return 'th'
      if (chinesePattern.test(text)) return 'zh'
      if (japanesePattern.test(text)) return 'ja'
      return 'en'
    }
    
    const detectedLanguage = detectLanguage(contentForQuiz)
    
    // Override options to preserve detected language
    let finalOptions = options || {}
    if (detectedLanguage !== 'en') {
      finalOptions = {
        ...finalOptions,
        responseLanguage: detectedLanguage
      }
    }

    console.log(`🎯 Generating quiz from chat session ${req.params.id}`)
    console.log(`📄 Content length: ${contentForQuiz.length} characters`)
    console.log(`🌐 Detected language: ${detectedLanguage}`)

    const questions = await aiChatService.generateQuizFromContent(contentForQuiz, finalOptions)

    console.log(`✅ Generated ${questions.length} questions from chat content`)

    res.json({
      success: true,
      questions,
      metadata: {
        source: "chat-content",
        sessionId: session._id,
        contentLength: contentForQuiz.length,
        generatedAt: new Date().toISOString(),
        ...finalOptions,
      },
    })
  } catch (error) {
    console.error("Generate quiz from chat error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz from chat content",
      error: error.message,
    })
  }
})

// Delete chat session
router.delete("/sessions/:id", auth, async (req, res) => {
  try {
    const session = await ChatSession.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!session) {
      return res.status(404).json({ message: "Chat session not found" })
    }

    res.json({ message: "Chat session deleted successfully" })
  } catch (error) {
    console.error("Delete chat session error:", error)
    res.status(500).json({ message: "Failed to delete chat session" })
  }
})

// Update chat session context
router.put("/sessions/:id/context", auth, async (req, res) => {
  try {
    const { context } = req.body

    const session = await ChatSession.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { context: { ...context } } },
      { new: true },
    )

    if (!session) {
      return res.status(404).json({ message: "Chat session not found" })
    }

    res.json(session.context)
  } catch (error) {
    console.error("Update context error:", error)
    res.status(500).json({ message: "Failed to update context" })
  }
})

export default router
