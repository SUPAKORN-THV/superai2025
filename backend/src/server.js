import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import fs from "fs"
import https from "https"
import http from "http"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '..', '.env') })

import connectDB from "./config/database.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import quizRoutes from "./routes/quizzes.js"
import adminRoutes from "./routes/admin.js"
import { errorHandler } from "./middleware/errorHandler.js"

async function startServer() {
  const app = express()
  const PORT = process.env.PORT || 3001

  console.log("🚀 Starting AI Quiz Application Server...")
  console.log("📊 Environment Variables Check:")
  console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "✅ Set" : "❌ Missing")
  console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing")
  console.log("- GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing")
  console.log("- FRONTEND_URL:", process.env.FRONTEND_URL || "http://localhost:5173")
  console.log("- SSL_ENABLED:", process.env.SSL_ENABLED === 'true' ? "✅ Enabled" : "❌ Disabled")
  console.log("- PUBLIC_URL:", process.env.PUBLIC_URL || "Not set")

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), "uploads")
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log("📁 Created uploads directory")
  }

  // Connect to MongoDB
  connectDB()

  // Security middleware
  app.use(helmet())
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    }),
  )

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
  app.use(limiter)

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true }))

  // Routes
  console.log("🛣️  Setting up routes...")
  app.use("/api/auth", authRoutes)
  app.use("/api/users", userRoutes)
  app.use("/api/quizzes", quizRoutes)
  app.use("/api/admin", adminRoutes)

  // Load AI and chat routes dynamically after environment is set
  const { default: aiRoutes } = await import("./routes/ai.js")
  const { default: chatRoutes } = await import("./routes/chat.js")
  app.use("/api/ai", aiRoutes)
  app.use("/api/chat", chatRoutes)

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      aiEnabled: !!process.env.GEMINI_API_KEY,
    })
  })

  // Error handling middleware
  app.use(errorHandler)

  // SSL Configuration
  const isSSLEnabled = process.env.SSL_ENABLED === 'true'
  let server

  if (isSSLEnabled) {
    try {
      const sslOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH || './ssl/private-key.pem'),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH || './ssl/certificate.pem')
      }
      server = https.createServer(sslOptions, app)
      console.log('🔒 SSL/HTTPS enabled')
    } catch (error) {
      console.error('❌ SSL certificate error:', error.message)
      console.log('⚠️  Falling back to HTTP')
      server = http.createServer(app)
    }
  } else {
    server = http.createServer(app)
  }

  server.listen(PORT, () => {
    const protocol = isSSLEnabled ? 'https' : 'http'
    const publicUrl = process.env.PUBLIC_URL || `${protocol}://localhost:${PORT}`
    
    console.log(`✅ Server running on port ${PORT}`)
    console.log(`🌐 Public URL: ${publicUrl}`)
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`)
    console.log(`🤖 AI Features: ${process.env.GEMINI_API_KEY ? "Enabled" : "Disabled"}`)
    console.log(`🔒 SSL: ${isSSLEnabled ? "Enabled" : "Disabled"}`)
  })

  return app
}

startServer().catch(console.error)

export default startServer
