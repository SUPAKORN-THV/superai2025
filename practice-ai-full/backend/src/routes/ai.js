import express from "express"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { auth } from "../middleware/auth.js"
import { VM } from "vm2"

const router = express.Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Generate quiz questions
router.post("/generate-quiz", auth, async (req, res) => {
  try {
    const { topic, language, difficulty, questionCount = 5 } = req.body

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Generate ${questionCount} quiz questions about ${topic} in ${language} programming language at ${difficulty} level. 

    Return a JSON array with this exact structure:
    [
      {
        "type": "single-choice|multiple-choice|code",
        "question": "Question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "correct answer or array for multiple choice",
        "explanation": "Detailed explanation",
        "difficulty": "${difficulty}",
        "points": 1,
        "codeTemplate": "// code template if applicable",
        "testCases": [{"input": "test input", "expectedOutput": "expected output"}]
      }
    ]

    Make questions practical and educational. Include a mix of question types.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI")
    }

    const questions = JSON.parse(jsonMatch[0])

    res.json({
      success: true,
      questions,
      metadata: {
        topic,
        language,
        difficulty,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("AI generation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz questions",
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

export default router
