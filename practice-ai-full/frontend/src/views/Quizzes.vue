<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Available Quizzes</h1>
      <p class="text-gray-600 mt-2">Choose a quiz to test your programming knowledge</p>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select v-model="filters.language" class="form-input">
            <option value="">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select v-model="filters.difficulty" class="form-input">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select v-model="filters.category" class="form-input">
            <option value="">All Categories</option>
            <option value="fundamentals">Fundamentals</option>
            <option value="algorithms">Algorithms</option>
            <option value="data-structures">Data Structures</option>
            <option value="web-development">Web Development</option>
            <option value="databases">Databases</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Quiz Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div class="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <div v-else-if="filteredQuizzes.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📝</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
      <p class="text-gray-600 mb-4">Try adjusting your filters or create a new quiz</p>
      <router-link
        to="/create-quiz"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
      >
        Create New Quiz
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="quiz in filteredQuizzes"
        :key="quiz._id"
        class="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition duration-300"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ quiz.title }}</h3>
          <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="getDifficultyColor(quiz.difficulty)"
          >
            {{ quiz.difficulty }}
          </span>
        </div>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ quiz.description }}</p>
        
        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ quiz.language }}
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ quiz.timeLimit }}min
            </span>
          </div>
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ quiz.questions.length }} questions
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            {{ quiz.totalAttempts }} attempts
          </div>
          <router-link
            :to="`/quiz/${quiz._id}`"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 text-sm font-medium"
          >
            Start Quiz
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const quizzes = ref([])
const loading = ref(true)
const filters = ref({
  language: '',
  difficulty: '',
  category: ''
})

const filteredQuizzes = computed(() => {
  return quizzes.value.filter(quiz => {
    return (!filters.value.language || quiz.language === filters.value.language) &&
           (!filters.value.difficulty || quiz.difficulty === filters.value.difficulty) &&
           (!filters.value.category || quiz.category === filters.value.category)
  })
})

const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }
  return colors[difficulty] || 'bg-gray-100 text-gray-800'
}

const clearFilters = () => {
  filters.value = {
    language: '',
    difficulty: '',
    category: ''
  }
}

const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/quizzes')
    quizzes.value = response.data
  } catch (error) {
    console.error('Failed to fetch quizzes:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchQuizzes()
})
</script>
