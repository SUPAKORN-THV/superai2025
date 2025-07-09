import express from "express"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { auth } from "../middleware/auth.js"
import { VM } from "vm2"

const router = express.Router()

// Initialize Gemini AI with error handling
let genAI, model
try {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables")
    throw new Error("GEMINI_API_KEY is required")
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    console.log("✅ Gemini AI initialized successfully")
  }
} catch (error) {
  console.error("❌ Failed to initialize Gemini AI:", error.message)
}

// Generate quiz questions
router.post("/generate-quiz", auth, async (req, res) => {
  try {
    if (!model) {
      return res.status(500).json({
        success: false,
        message: "AI service is not available. Please check GEMINI_API_KEY configuration.",
        error: "Gemini AI not initialized",
      })
    }

    const {
      topic,
      language,
      difficulty,
      questionCount = 5,
      questionTypes = ["single-choice", "multiple-choice"],
    } = req.body

    // Validate required fields
    if (!topic || !language || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: topic, language, and difficulty are required",
      })
    }

    console.log(`🤖 Generating ${questionCount} questions for ${topic} in ${language} (${difficulty} level)`)

    const getCodeTemplate = (lang) => {
      const templates = {
        javascript: `// Write your JavaScript code here
function solution() {
    // Your answer here
    
}`,
        python: `# Write your Python code here
def solution():
    # Your answer here
    pass`,
        java: `public class Solution {
    public static void main(String[] args) {
        // Your answer here
        
    }
}`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    // Your answer here
    
    return 0;
}`,
        c: `#include <stdio.h>

int main() {
    // Your answer here
    
    return 0;
}`
      }
      return templates[lang] || `// Write your ${lang} code here`
    }

    const prompt = `Generate ${questionCount} quiz questions about "${topic}" in ${language} programming language at ${difficulty} level. 

    Question types to include: ${questionTypes.join(", ")}
    
    For code questions, use this template:
    ${getCodeTemplate(language)}

    Return a JSON array with this EXACT structure (no additional text or formatting):
    [
      {
        "type": "single-choice",
        "question": "What is the correct way to declare a variable in ${language}?",
        "options": ["var x = 5;", "let x = 5;", "const x = 5;", "x = 5;"],
        "correctAnswer": "let x = 5;",
        "explanation": "let is the modern way to declare variables in JavaScript",
        "difficulty": "${difficulty}",
        "points": 1,
        "codeTemplate": "${getCodeTemplate(language)}"
      }
    ]

    Requirements:
    - Make questions practical and educational
    - Include clear explanations
    - Ensure options are realistic and challenging
    - Focus on ${topic} concepts
    - Use ${difficulty} appropriate complexity
    - For code questions, include codeTemplate with proper imports/boilerplate
    - Return ONLY the JSON array, no other text`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("🔍 Raw AI Response:", text.substring(0, 200) + "...")

    // Clean and parse JSON from response
    let cleanedText = text.trim()

    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\s*/g, "").replace(/```\s*/g, "")

    // Find JSON array in the response
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("❌ No valid JSON array found in AI response")
      throw new Error("Invalid response format from AI - no JSON array found")
    }

    let questions
    try {
      questions = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error("❌ JSON parsing failed:", parseError.message)
      throw new Error("Failed to parse AI response as JSON")
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI returned invalid questions format")
    }

    // Validate each question
    const validatedQuestions = questions
      .map((q, index) => {
        if (!q.question || !q.type || !q.correctAnswer) {
          console.warn(`⚠️ Question ${index + 1} missing required fields, skipping`)
          return null
        }

        return {
          type: q.type || "single-choice",
          question: q.question,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || "No explanation provided",
          difficulty: q.difficulty || difficulty,
          points: q.points || 1,
          codeTemplate: q.codeTemplate || null,
          testCases: q.testCases || [],
        }
      })
      .filter(Boolean)

    if (validatedQuestions.length === 0) {
      throw new Error("No valid questions generated")
    }

    console.log(`✅ Successfully generated ${validatedQuestions.length} questions`)

    res.json({
      success: true,
      questions: validatedQuestions,
      metadata: {
        topic,
        language,
        difficulty,
        questionCount: validatedQuestions.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ AI generation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz questions",
      error: error.message,
      details: "Check server logs for more information",
    })
  }
})

// Test AI connection endpoint
router.get("/test-connection", auth, async (req, res) => {
  try {
    if (!model) {
      return res.status(500).json({
        success: false,
        message: "Gemini AI is not initialized",
        hasApiKey: !!process.env.GEMINI_API_KEY,
      })
    }

    // Test with a simple prompt
    const result = await model.generateContent(
      'Say \'Hello, AI is working!\' in JSON format: {"message": "your response"}',
    )
    const response = await result.response
    const text = response.text()

    res.json({
      success: true,
      message: "AI connection is working",
      testResponse: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI connection test failed:", error)
    res.status(500).json({
      success: false,
      message: "AI connection test failed",
      error: error.message,
    })
  }
})

// Execute code in sandbox
router.post("/execute-code", auth, async (req, res) => {
  try {
    const { code, language, testCases } = req.body

    if (language !== "javascript") {
      return res.status(400).json({
        success: false,
        message: "Only JavaScript execution is currently supported",
      })
    }

    if (!testCases || !Array.isArray(testCases)) {
      return res.status(400).json({
        success: false,
        message: "Test cases are required for code execution",
      })
    }

    const results = []

    for (const testCase of testCases) {
      try {
        const vm = new VM({
          timeout: 5000, // 5 second timeout
          sandbox: {
            input: testCase.input,
            console: {
              log: (...args) => results.push({ type: "log", content: args.join(" ") }),
            },
          },
        })

        const result = vm.run(`
          ${code}
          
          // Return the result
          if (typeof main === 'function') {
            main(input);
          } else if (typeof solve === 'function') {
            solve(input);
          } else {
            // Execute the code directly
            ${code}
          }
        `)

        results.push({
          testCase: testCase.input,
          expected: testCase.expectedOutput,
          actual: result,
          passed: String(result) === String(testCase.expectedOutput),
        })
      } catch (error) {
        results.push({
          testCase: testCase.input,
          expected: testCase.expectedOutput,
          actual: null,
          error: error.message,
          passed: false,
        })
      }
    }

    const allPassed = results.every((r) => r.passed)

    res.json({
      success: true,
      results,
      allPassed,
      executedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Code execution error:", error)
    res.status(500).json({
      success: false,
      message: "Code execution failed",
      error: error.message,
    })
  }
})

// Generate quiz from text content
router.post("/generate-from-content", auth, async (req, res) => {
  try {
    if (!model) {
      return res.status(500).json({
        success: false,
        message: "AI service is not available",
      })
    }

    const { content, options = {} } = req.body
    const {
      topic = "Programming",
      language = "javascript",
      difficulty = "beginner",
      questionCount = 5,
      questionTypes = ["single-choice", "multiple-choice"],
    } = options

    if (!content || content.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Content must be at least 50 characters long",
      })
    }

    console.log(`🤖 Generating quiz from content (${content.length} chars)`)

    const prompt = `Based on the following content, generate ${questionCount} quiz questions about ${topic} in ${language} programming language at ${difficulty} level.

Content:
${content.substring(0, 3000)}

Question types to include: ${questionTypes.join(", ")}

Return a JSON array with this EXACT structure (no additional text):
[
  {
    "type": "single-choice",
    "question": "Based on the content, what is...",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Option 1",
    "explanation": "Detailed explanation based on the content",
    "difficulty": "${difficulty}",
    "points": 1
  }
]

Make questions directly related to the provided content.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON from response
    const cleanedText = text
      .trim()
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/)

    if (!jsonMatch) {
      throw new Error("Invalid response format from AI")
    }

    const questions = JSON.parse(jsonMatch[0])

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No valid questions generated from content")
    }

    console.log(`✅ Generated ${questions.length} questions from content`)

    res.json({
      success: true,
      questions,
      metadata: {
        source: "content-based",
        contentLength: content.length,
        generatedAt: new Date().toISOString(),
        ...options,
      },
    })
  } catch (error) {
    console.error("Content-based generation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz from content",
      error: error.message,
    })
  }
})

export default router
