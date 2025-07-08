<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading quiz...</p>
    </div>

    <div v-else-if="!quiz" class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h2>
      <router-link to="/quizzes" class="text-indigo-600 hover:text-indigo-500">
        Back to quizzes
      </router-link>
    </div>

    <div v-else-if="!quizStarted" class="bg-white rounded-lg shadow-sm border p-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ quiz.title }}</h1>
        <p class="text-gray-600 mb-6">{{ quiz.description }}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ quiz.questions.length }}</div>
            <div class="text-sm text-gray-600">Questions</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ quiz.timeLimit }}</div>
            <div class="text-sm text-gray-600">Minutes</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ quiz.totalPoints }}</div>
            <div class="text-sm text-gray-600">Points</div>
          </div>
        </div>
        
        <div class="flex items-center justify-center space-x-4">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {{ quiz.language }}
          </span>
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {{ quiz.difficulty }}
          </span>
        </div>
        
        <button
          @click="startQuiz"
          class="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300"
        >
          Start Quiz
        </button>
      </div>
    </div>

    <div v-else-if="!quizCompleted" class="space-y-6">
      <!-- Quiz Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-gray-900">{{ quiz.title }}</h1>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}
            </div>
            <div class="text-sm font-medium text-indigo-600">
              {{ formatTime(timeRemaining) }}
            </div>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Current Question -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            {{ currentQuestion.question }}
          </h2>
          
          <!-- Single Choice -->
          <div v-if="currentQuestion.type === 'single-choice'" class="space-y-3">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="flex items-center"
            >
              <input
                :id="`option-${index}`"
                v-model="currentAnswer"
                :value="option"
                type="radio"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label :for="`option-${index}`" class="ml-3 text-gray-700 cursor-pointer">
                {{ option }}
              </label>
            </div>
          </div>
          
          <!-- Multiple Choice -->
          <div v-else-if="currentQuestion.type === 'multiple-choice'" class="space-y-3">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="flex items-center"
            >
              <input
                :id="`option-${index}`"
                v-model="currentAnswer"
                :value="option"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label :for="`option-${index}`" class="ml-3 text-gray-700 cursor-pointer">
                {{ option }}
              </label>
            </div>
          </div>
          
          <!-- Free Text -->
          <div v-else-if="currentQuestion.type === 'free-text'">
            <textarea
              v-model="currentAnswer"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your answer..."
            ></textarea>
          </div>
          
          <!-- Code Question -->
          <div v-else-if="currentQuestion.type === 'code'">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Your Code:</label>
              <textarea
                v-model="currentAnswer"
                rows="10"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                :placeholder="currentQuestion.codeTemplate || 'Write your code here...'"
              ></textarea>
            </div>
            
            <button
              @click="testCode"
              :disabled="testingCode"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition duration-300"
            >
              <span v-if="testingCode">Testing...</span>
              <span v-else>Test Code</span>
            </button>
            
            <div v-if="codeTestResults" class="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 class="font-medium text-gray-900 mb-2">Test Results:</h4>
              <div v-for="(result, index) in codeTestResults.results" :key="index" class="text-sm">
                <span :class="result.passed ? 'text-green-600' : 'text-red-600'">
                  Test {{ index + 1 }}: {{ result.passed ? 'PASSED' : 'FAILED' }}
                </span>
                <div v-if="!result.passed" class="text-gray-600 ml-4">
                  Expected: {{ result.expected }}, Got: {{ result.actual }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <button
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
            class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition duration-300"
          >
            Previous
          </button>
          
          <button
            @click="nextQuestion"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            {{ currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-else class="bg-white rounded-lg shadow-sm border p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
        <div class="text-6xl mb-4">
          {{ results.percentage >= 90 ? '🎉' : results.percentage >= 70 ? '👏' : '📚' }}
        </div>
        <div class="text-4xl font-bold mb-2" :class="getScoreColor(results.percentage)">
          {{ results.percentage }}%
        </div>
        <p class="text-gray-600">
          {{ results.score }} out of {{ results.totalPoints }} points
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ results.score }}</div>
          <div class="text-sm text-gray-600">Points Earned</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ formatTime(results.timeSpent) }}</div>
          <div class="text-sm text-gray-600">Time Spent</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">
            {{ results.results.filter(r => r.isCorrect).length }}
          </div>
          <div class="text-sm text-gray-600">Correct Answers</div>
        </div>
      </div>
      
      <div class="space-y-4 mb-8">
        <h3 class="text-lg font-semibold text-gray-900">Question Review:</h3>
        <div
          v-for="(result, index) in results.results"
          :key="index"
          class="border rounded-lg p-4"
        >
          <div class="flex items-start justify-between mb-2">
            <h4 class="font-medium text-gray-900">Question {{ index + 1 }}</h4>
            <span :class="result.isCorrect ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ result.isCorrect ? 'Correct' : 'Incorrect' }}
            </span>
          </div>
          
          <p class="text-gray-700 mb-3">{{ result.question }}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-900">Your Answer:</span>
              <span :class="result.isCorrect ? 'text-green-600' : 'text-red-600'">
                {{ result.userAnswer }}
              </span>
            </div>
            <div>
              <span class="font-medium text-gray-900">Correct Answer:</span>
              <span class="text-green-600">{{ result.correctAnswer }}</span>
            </div>
          </div>
          
          <div v-if="result.explanation" class="mt-3 p-3 bg-blue-50 rounded-md">
            <span class="font-medium text-blue-900">Explanation:</span>
            <p class="text-blue-800 mt-1">{{ result.explanation }}</p>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-center space-x-4">
        <router-link
          to="/quizzes"
          class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Take Another Quiz
        </router-link>
        <router-link
          to="/dashboard"
          class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const quiz = ref(null)
const loading = ref(true)
const quizStarted = ref(false)
const quizCompleted = ref(false)
const currentQuestionIndex = ref(0)
const answers = ref([])
const currentAnswer = ref('')
const startTime = ref(null)
const timeRemaining = ref(0)
const timer = ref(null)
const results = ref(null)
const testingCode = ref(false)
const codeTestResults = ref(null)

const currentQuestion = computed(() => {
  return quiz.value?.questions[currentQuestionIndex.value]
})

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getScoreColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const fetchQuiz = async () => {
  try {
    const response = await api.get(`/api/quizzes/${route.params.id}`)
    quiz.value = response.data
    timeRemaining.value = quiz.value.timeLimit * 60
  } catch (error) {
    console.error('Failed to fetch quiz:', error)
  } finally {
    loading.value = false
  }
}

const startQuiz = () => {
  quizStarted.value = true
  startTime.value = Date.now()
  
  // Initialize answers array
  answers.value = quiz.value.questions.map(q => ({
    questionId: q._id,
    answer: q.type === 'multiple-choice' ? [] : '',
    timeSpent: 0
  }))
  
  // Start timer
  timer.value = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      submitQuiz()
    }
  }, 1000)
}

const nextQuestion = () => {
  saveCurrentAnswer()
  
  if (currentQuestionIndex.value === quiz.value.questions.length - 1) {
    submitQuiz()
  } else {
    currentQuestionIndex.value++
    loadCurrentAnswer()
  }
}

const previousQuestion = () => {
  saveCurrentAnswer()
  currentQuestionIndex.value--
  loadCurrentAnswer()
}

const saveCurrentAnswer = () => {
  if (answers.value[currentQuestionIndex.value]) {
    answers.value[currentQuestionIndex.value].answer = currentAnswer.value
  }
}

const loadCurrentAnswer = () => {
  const answer = answers.value[currentQuestionIndex.value]
  currentAnswer.value = answer ? answer.answer : (currentQuestion.value.type === 'multiple-choice' ? [] : '')
}

const testCode = async () => {
  if (!currentAnswer.value.trim()) return
  
  testingCode.value = true
  
  try {
    const response = await api.post('/api/ai/execute-code', {
      code: currentAnswer.value,
      language: quiz.value.language,
      testCases: currentQuestion.value.testCases || []
    })
    
    codeTestResults.value = response.data
  } catch (error) {
    console.error('Code test failed:', error)
    alert('Failed to test code. Please try again.')
  } finally {
    testingCode.value = false
  }
}

const submitQuiz = async () => {
  saveCurrentAnswer()
  
  if (timer.value) {
    clearInterval(timer.value)
  }
  
  const totalTimeSpent = Math.floor((Date.now() - startTime.value) / 1000)
  
  try {
    const response = await api.post(`/api/quizzes/${route.params.id}/attempt`, {
      answers: answers.value,
      timeSpent: totalTimeSpent
    })
    
    results.value = response.data
    quizCompleted.value = true
  } catch (error) {
    console.error('Failed to submit quiz:', error)
    alert('Failed to submit quiz. Please try again.')
  }
}

onMounted(() => {
  fetchQuiz()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>
