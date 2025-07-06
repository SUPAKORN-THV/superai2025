<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Timer Bar -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-lg font-semibold text-gray-900">{{ quiz.title }}</h1>
            <span class="text-sm text-gray-500">Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}</span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium" :class="timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'">
                {{ formatTime(timeRemaining) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 h-1">
          <div 
            class="h-1 transition-all duration-300"
            :class="timeRemaining < 300 ? 'bg-red-500' : 'bg-indigo-600'"
            :style="{ width: `${(quiz.timeLimit * 60 - timeRemaining) / (quiz.timeLimit * 60) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Question Card -->
      <div class="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {{ currentQuestion.question }}
          </h2>
          
          <!-- Multiple Choice Question -->
          <div v-if="currentQuestion.type === 'multiple-choice'" class="space-y-3">
            <div 
              v-for="(option, index) in currentQuestion.options" 
              :key="index"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'border-indigo-500 bg-indigo-50': answers[currentQuestionIndex] === option }"
              @click="selectAnswer(option)"
            >
              <input
                :id="`option-${index}`"
                type="radio"
                :name="`question-${currentQuestionIndex}`"
                :value="option"
                :checked="answers[currentQuestionIndex] === option"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                @change="selectAnswer(option)"
              />
              <label :for="`option-${index}`" class="ml-3 text-sm text-gray-700 cursor-pointer flex-1">
                {{ option }}
              </label>
            </div>
          </div>

          <!-- Multiple Select Question -->
          <div v-else-if="currentQuestion.type === 'multiple-select'" class="space-y-3">
            <div 
              v-for="(option, index) in currentQuestion.options" 
              :key="index"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'border-indigo-500 bg-indigo-50': isOptionSelected(option) }"
              @click="toggleMultipleAnswer(option)"
            >
              <input
                :id="`checkbox-${index}`"
                type="checkbox"
                :checked="isOptionSelected(option)"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                @change="toggleMultipleAnswer(option)"
              />
              <label :for="`checkbox-${index}`" class="ml-3 text-sm text-gray-700 cursor-pointer flex-1">
                {{ option }}
              </label>
            </div>
          </div>

          <!-- True/False Question -->
          <div v-else-if="currentQuestion.type === 'true-false'" class="space-y-3">
            <div 
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'border-indigo-500 bg-indigo-50': answers[currentQuestionIndex] === 'true' }"
              @click="selectAnswer('true')"
            >
              <input
                id="true-option"
                type="radio"
                :name="`question-${currentQuestionIndex}`"
                value="true"
                :checked="answers[currentQuestionIndex] === 'true'"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label for="true-option" class="ml-3 text-sm text-gray-700 cursor-pointer flex-1">True</label>
            </div>
            <div 
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'border-indigo-500 bg-indigo-50': answers[currentQuestionIndex] === 'false' }"
              @click="selectAnswer('false')"
            >
              <input
                id="false-option"
                type="radio"
                :name="`question-${currentQuestionIndex}`"
                value="false"
                :checked="answers[currentQuestionIndex] === 'false'"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label for="false-option" class="ml-3 text-sm text-gray-700 cursor-pointer flex-1">False</label>
            </div>
          </div>

          <!-- Code Editor Question -->
          <div v-else-if="currentQuestion.type === 'code'" class="space-y-4">
            <div class="bg-gray-900 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-300">{{ currentQuestion.language || 'JavaScript' }}</span>
                <button 
                  @click="runCode"
                  class="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Run Code
                </button>
              </div>
              <textarea
                v-model="codeAnswer"
                class="w-full h-40 bg-gray-800 text-green-400 font-mono text-sm p-3 rounded border-none resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :placeholder="currentQuestion.placeholder || 'Write your code here...'"
                @input="updateCodeAnswer"
              ></textarea>
            </div>
            <div v-if="codeOutput" class="bg-gray-100 rounded-lg p-3">
              <div class="text-xs text-gray-600 mb-1">Output:</div>
              <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ codeOutput }}</pre>
            </div>
          </div>

          <!-- Short Answer Question -->
          <div v-else-if="currentQuestion.type === 'short-answer'" class="space-y-3">
            <textarea
              v-model="textAnswer"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :placeholder="currentQuestion.placeholder || 'Enter your answer...'"
              @input="updateTextAnswer"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between items-center">
        <button
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
          class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Previous
        </button>

        <div class="flex space-x-2">
          <button
            v-if="currentQuestionIndex < quiz.questions.length - 1"
            @click="nextQuestion"
            class="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors"
          >
            Next
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          <button
            v-else
            @click="submitQuiz"
            class="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
          >
            Submit Quiz
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Results Modal -->
    <div v-if="showResults" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="score >= quiz.passingScore ? 'bg-green-100' : 'bg-red-100'">
            <svg v-if="score >= quiz.passingScore" class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Quiz Complete!</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 mb-4">
              {{ score >= quiz.passingScore ? 'Congratulations! You passed the quiz.' : 'You did not meet the passing score. Keep studying!' }}
            </p>
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Your Score:</span>
                <span class="text-2xl font-bold" :class="score >= quiz.passingScore ? 'text-green-600' : 'text-red-600'">
                  {{ score }}%
                </span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Correct Answers:</span>
                <span class="text-sm font-medium text-gray-900">{{ correctAnswers }} / {{ quiz.questions.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Time Taken:</span>
                <span class="text-sm font-medium text-gray-900">{{ formatTime(quiz.timeLimit * 60 - timeRemaining) }}</span>
              </div>
            </div>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="closeResults"
              class="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const currentQuestionIndex = ref(0)
const answers = ref({})
const codeAnswer = ref('')
const textAnswer = ref('')
const codeOutput = ref('')
const timeRemaining = ref(1800) // 30 minutes in seconds
const showResults = ref(false)
const score = ref(0)
const correctAnswers = ref(0)

// Mock quiz data
const quiz = reactive({
  title: 'JavaScript Fundamentals Quiz',
  timeLimit: 30, // minutes
  passingScore: 70,
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
      correctAnswer: 'var myVar;'
    },
    {
      id: 2,
      type: 'true-false',
      question: 'JavaScript is a statically typed language.',
      correctAnswer: 'false'
    },
    {
      id: 3,
      type: 'multiple-select',
      question: 'Which of the following are JavaScript data types?',
      options: ['String', 'Number', 'Boolean', 'Character'],
      correctAnswers: ['String', 'Number', 'Boolean']
    },
    {
      id: 4,
      type: 'code',
      question: 'Write a function that returns the sum of two numbers:',
      language: 'JavaScript',
      placeholder: 'function sum(a, b) {\n  // Your code here\n}',
      correctAnswer: 'function sum(a, b) { return a + b; }'
    },
    {
      id: 5,
      type: 'short-answer',
      question: 'Explain the difference between == and === in JavaScript.',
      placeholder: 'Enter your explanation here...',
      correctAnswer: '== compares values with type coercion, === compares values and types strictly'
    }
  ]
})

const currentQuestion = computed(() => quiz.questions[currentQuestionIndex.value])

let timer = null

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const startTimer = () => {
  timer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      submitQuiz()
    }
  }, 1000)
}

const selectAnswer = (answer) => {
  answers.value[currentQuestionIndex.value] = answer
}

const toggleMultipleAnswer = (option) => {
  if (!answers.value[currentQuestionIndex.value]) {
    answers.value[currentQuestionIndex.value] = []
  }
  
  const currentAnswers = answers.value[currentQuestionIndex.value]
  const index = currentAnswers.indexOf(option)
  
  if (index > -1) {
    currentAnswers.splice(index, 1)
  } else {
    currentAnswers.push(option)
  }
}

const isOptionSelected = (option) => {
  const currentAnswers = answers.value[currentQuestionIndex.value]
  return currentAnswers && currentAnswers.includes(option)
}

const updateCodeAnswer = () => {
  answers.value[currentQuestionIndex.value] = codeAnswer.value
}

const updateTextAnswer = () => {
  answers.value[currentQuestionIndex.value] = textAnswer.value
}

const runCode = () => {
  try {
    // Simple code execution simulation
    codeOutput.value = `Code executed successfully!\nFunction defined: ${codeAnswer.value.split('\n')[0]}`
  } catch (error) {
    codeOutput.value = `Error: ${error.message}`
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < quiz.questions.length - 1) {
    currentQuestionIndex.value++
    loadQuestionData()
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    loadQuestionData()
  }
}

const loadQuestionData = () => {
  const currentAnswer = answers.value[currentQuestionIndex.value]
  
  if (currentQuestion.value.type === 'code') {
    codeAnswer.value = currentAnswer || ''
  } else if (currentQuestion.value.type === 'short-answer') {
    textAnswer.value = currentAnswer || ''
  }
}

const submitQuiz = async () => {
  if (timer) {
    clearInterval(timer)
  }

  try {
    // Calculate score
    let correct = 0
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers.value[index]
      
      if (question.type === 'multiple-select') {
        if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswers)) {
          const isCorrect = question.correctAnswers.length === userAnswer.length &&
            question.correctAnswers.every(answer => userAnswer.includes(answer))
          if (isCorrect) correct++
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correct++
        }
      }
    })

    correctAnswers.value = correct
    score.value = Math.round((correct / quiz.questions.length) * 100)

    // Submit to API
    const attemptData = {
      quizId: quiz.id,
      answers: answers.value,
      score: score.value,
      timeSpent: quiz.timeLimit * 60 - timeRemaining.value,
      completedAt: new Date().toISOString()
    }

    // Simulate API call to /api/questions/attempt
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Quiz submitted:', attemptData)

    showResults.value = true

  } catch (error) {
    console.error('Error submitting quiz:', error)
  }
}

const closeResults = () => {
  showResults.value = false
  // Navigate back to dashboard
  console.log('Navigating back to dashboard...')
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>
