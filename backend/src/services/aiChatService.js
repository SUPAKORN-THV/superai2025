import { GoogleGenerativeAI } from "@google/generative-ai"

export class AIChatService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required")
    }

    try {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
      console.log("✅ AIChatService: Gemini AI initialized successfully")
    } catch (error) {
      console.error("❌ AIChatService: Failed to initialize Gemini AI:", error)
      throw error
    }
  }

  async generateResponse(messages, context = {}) {
    try {
      const conversationHistory = this.buildConversationHistory(messages, context)
      console.log("🤖 Generating AI response with context:", Object.keys(context))

      const result = await this.model.generateContent(conversationHistory)
      const response = await result.response
      const text = response.text()

      console.log("✅ AI response generated successfully")
      return text
    } catch (error) {
      console.error("❌ AI Chat error:", error)
      throw new Error(`Failed to generate AI response: ${error.message}`)
    }
  }

  buildConversationHistory(messages, context) {
    const systemPrompt = `You are an AI assistant specialized in creating educational quizzes and helping with programming concepts. You can:

1. Generate quiz questions based on uploaded content (PDFs, images, documents)
2. Explain programming concepts in multiple languages (JavaScript, Python, Java, C++, HTML, CSS, SQL)
3. Create different types of questions: single-choice, multiple-choice, and coding challenges
4. Provide detailed explanations for answers
5. Adapt difficulty levels (beginner, intermediate, advanced)

Current context:
- Topic: ${context.topic || "General Programming"}
- Language: ${context.language || "Not specified"}
- Difficulty: ${context.difficulty || "Not specified"}
- Extracted Content: ${context.extractedContent ? "Available" : "None"}

${context.extractedContent ? `\nContent from uploaded files:\n${context.extractedContent.substring(0, 2000)}...` : ""}

Guidelines:
- Be helpful and educational
- Provide clear, accurate information
- When generating quizzes, format them as JSON when requested
- Explain concepts step by step
- Encourage learning and understanding
- If asked to generate a quiz, provide structured questions with explanations`

    const conversation = messages
      .map((msg) => {
        if (msg.role === "user") {
          let content = msg.content
          if (msg.attachments && msg.attachments.length > 0) {
            const attachmentInfo = msg.attachments
              .map((att) => `[File: ${att.originalName || att.filename} - ${att.extractedText?.substring(0, 500)}...]`)
              .join("\n")
            content += `\n\nAttached files:\n${attachmentInfo}`
          }
          return `User: ${content}`
        }
        return `Assistant: ${msg.content}`
      })
      .join("\n\n")

    return `${systemPrompt}\n\nConversation:\n${conversation}\n\nPlease provide a helpful response:`
  }

  async generateQuizFromContent(content, options = {}) {
    const {
      topic = "Programming",
      language = "javascript",
      difficulty = "beginner",
      questionCount = 5,
      questionTypes = ["single-choice", "multiple-choice"],
    } = options

    console.log(`🎯 Generating ${questionCount} questions from content (${content.length} chars)`)

    const languageInstruction = options.responseLanguage && options.responseLanguage !== 'en' 
      ? `\n\nCRITICAL: Generate ALL content (questions, options, explanations, code) in the EXACT SAME LANGUAGE as the provided content. Do NOT translate anything to English. Preserve the original language completely.`
      : ''

    const prompt = `Based on the following content, generate ${questionCount} quiz questions about ${topic} in ${language} programming language at ${difficulty} level.

Content:
${content.substring(0, 4000)}

Question types to include: ${questionTypes.join(", ")}

Return a JSON array with this EXACT structure (no additional text or formatting):
[
  {
    "type": "single-choice",
    "question": "Based on the content, what is the correct way to...",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Option 1",
    "explanation": "Detailed explanation based on the provided content",
    "difficulty": "${difficulty}",
    "points": 1,
    "codeTemplate": "// For code questions only\n#include <iostream>\nint main() {\n    // Your code here\n    return 0;\n}"
  }
]

Requirements:
- Base questions directly on the provided content
- Preserve the EXACT language and terminology from the original content
- For code questions, include codeTemplate with proper language syntax
- Include clear explanations in the same language as content
- Ensure options are realistic and challenging
- Use ${difficulty} appropriate complexity
- Return ONLY the JSON array, no other text${languageInstruction}`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      console.log("🔍 Raw AI Response for quiz generation:", text.substring(0, 200) + "...")

      // Clean and extract JSON from response
      let cleanedText = text.trim()
      cleanedText = cleanedText.replace(/```json\s*/g, "").replace(/```\s*/g, "")

      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        console.error("❌ No valid JSON array found in AI response")
        throw new Error("Invalid response format from AI - no JSON array found")
      }

      const questions = JSON.parse(jsonMatch[0])

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("AI returned invalid questions format")
      }

      console.log(`✅ Successfully generated ${questions.length} questions from content`)
      return questions
    } catch (error) {
      console.error("❌ Quiz generation error:", error)
      throw new Error(`Failed to generate quiz from content: ${error.message}`)
    }
  }

  async suggestImprovements(quizData) {
    const prompt = `Analyze this quiz and suggest improvements:

Quiz: ${JSON.stringify(quizData, null, 2)}

Please provide suggestions for:
1. Question clarity and accuracy
2. Answer options quality
3. Difficulty balance
4. Educational value
5. Additional question ideas

Format your response as actionable suggestions.`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error("❌ Quiz analysis error:", error)
      throw new Error(`Failed to analyze quiz: ${error.message}`)
    }
  }
}
