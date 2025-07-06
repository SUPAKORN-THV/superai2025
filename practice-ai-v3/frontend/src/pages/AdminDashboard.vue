<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Welcome, {{ user.name }}</span>
            <button 
              @click="logout"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State for Stats -->
      <div v-if="statsLoading" class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow p-6 animate-pulse">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
              <div class="ml-4 flex-1">
                <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div class="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistical Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Users Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Users</p>
              <p class="text-2xl font-semibold text-gray-900" data-testid="total-users">
                {{ formatNumber(dashboardStats.totalUsers) }}
              </p>
              <p class="text-xs text-green-600 mt-1">
                +{{ dashboardStats.newUsersThisMonth }} this month
              </p>
            </div>
          </div>
        </div>

        <!-- Total Quizzes Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Quizzes</p>
              <p class="text-2xl font-semibold text-gray-900" data-testid="total-quizzes">
                {{ formatNumber(dashboardStats.totalQuizzes) }}
              </p>
              <p class="text-xs text-blue-600 mt-1">
                {{ dashboardStats.activeQuizzes }} active
              </p>
            </div>
          </div>
        </div>

        <!-- Average Quiz Attempts Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Avg Quiz Attempts</p>
              <p class="text-2xl font-semibold text-gray-900" data-testid="avg-attempts">
                {{ dashboardStats.averageQuizAttempts.toFixed(1) }}
              </p>
              <p class="text-xs text-purple-600 mt-1">
                per user
              </p>
            </div>
          </div>
        </div>

        <!-- Total Questions Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Questions</p>
              <p class="text-2xl font-semibold text-gray-900" data-testid="total-questions">
                {{ formatNumber(dashboardStats.totalQuestions) }}
              </p>
              <p class="text-xs text-orange-600 mt-1">
                in question bank
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Question Bank Section -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Question Bank</h2>
            <p class="text-sm text-gray-500 mt-1">
              Manage and edit quiz questions
            </p>
          </div>
          <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <button 
              @click="refreshQuestions"
              :disabled="questionsLoading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': questionsLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
            <button 
              @click="createNewQuestion"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Question
            </button>
          </div>
        </div>

        <!-- Questions Loading State -->
        <div v-if="questionsLoading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div class="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div v-else-if="questions.length > 0" class="divide-y divide-gray-200">
          <div 
            v-for="question in questions" 
            :key="question.id" 
            class="p-6 hover:bg-gray-50 transition-colors"
            data-testid="question-item"
          >
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        :class="getQuestionTypeColor(question.type)">
                    {{ formatQuestionType(question.type) }}
                  </span>
                  <span class="text-xs text-gray-500">
                    Quiz ID: {{ question.quizId }}
                  </span>
                </div>
                
                <h3 class="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                  {{ question.questionText }}
                </h3>
                
                <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>Created: {{ formatDate(question.createdAt) }}</span>
                  <span v-if="question.difficulty">
                    Difficulty: 
                    <span :class="getDifficultyColor(question.difficulty)">
                      {{ question.difficulty }}
                    </span>
                  </span>
                  <span v-if="question.category">
                    Category: {{ question.category }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center gap-2 flex-shrink-0">
                <button 
                  @click="editQuestion(question.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  data-testid="edit-question-btn"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
                
                <button 
                  @click="deleteQuestion(question.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating your first question.</p>
          <div class="mt-6">
            <button 
              @click="createNewQuestion"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Question
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div class="mb-4 sm:mb-0">
              <p class="text-sm text-gray-700">
                Showing 
                <span class="font-medium">{{ (pagination.currentPage - 1) * pagination.perPage + 1 }}</span>
                to 
                <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems) }}</span>
                of 
                <span class="font-medium">{{ pagination.totalItems }}</span>
                results
              </p>
            </div>
            
            <div class="flex justify-center sm:justify-end">
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <!-- Previous Button -->
                <button
                  @click="goToPage(pagination.currentPage - 1)"
                  :disabled="pagination.currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  data-testid="prev-page-btn"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                <!-- Page Numbers -->
                <template v-for="page in getVisiblePages()" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors',
                      page === pagination.currentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                    data-testid="page-btn"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                </template>

                <!-- Next Button -->
                <button
                  @click="goToPage(pagination.currentPage + 1)"
                  :disabled="pagination.currentPage === pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  data-testid="next-page-btn"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

// User data
const user = reactive({
  name: 'Admin User',
  email: 'admin@example.com'
})

// Dashboard stats
const dashboardStats = reactive({
  totalUsers: 0,
  totalQuizzes: 0,
  averageQuizAttempts: 0,
  totalQuestions: 0,
  newUsersThisMonth: 0,
  activeQuizzes: 0
})

// Questions data
const questions = ref([])
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0
})

// Loading states
const statsLoading = ref(true)
const questionsLoading = ref(true)

// Fetch dashboard statistics
const fetchDashboardStats = async () => {
  statsLoading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await fetch('/api/admin/dashboard-stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Update dashboard stats
    Object.assign(dashboardStats, data)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    // Mock data for demo purposes
    Object.assign(dashboardStats, {
      totalUsers: 1247,
      totalQuizzes: 89,
      averageQuizAttempts: 3.2,
      totalQuestions: 456,
      newUsersThisMonth: 23,
      activeQuizzes: 67
    })
  } finally {
    statsLoading.value = false
  }
}

// Fetch questions with pagination
const fetchQuestions = async (page = 1) => {
  questionsLoading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await fetch(`/api/questions?page=${page}&limit=${pagination.perPage}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    questions.value = data.questions || data.data || []
    pagination.currentPage = data.currentPage || page
    pagination.totalItems = data.totalItems || data.total || 0
    pagination.totalPages = Math.ceil(pagination.totalItems / pagination.perPage)
  } catch (error) {
    console.error('Error fetching questions:', error)
    
    // Mock data for demo purposes
    const mockQuestions = generateMockQuestions()
    const startIndex = (page - 1) * pagination.perPage
    const endIndex = startIndex + pagination.perPage
    
    questions.value = mockQuestions.slice(startIndex, endIndex)
    pagination.currentPage = page
    pagination.totalItems = mockQuestions.length
    pagination.totalPages = Math.ceil(mockQuestions.length / pagination.perPage)
  } finally {
    questionsLoading.value = false
  }
}

// Generate mock questions for demo
const generateMockQuestions = () => {
  const questionTypes = ['multiple-choice', 'true-false', 'short-answer', 'code']
  const difficulties = ['easy', 'medium', 'hard']
  const categories = ['JavaScript', 'Python', 'React', 'Vue', 'CSS', 'HTML']
  
  return Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    questionText: `Sample question ${i + 1}: What is the correct way to implement this concept?`,
    type: questionTypes[i % questionTypes.length],
    quizId: Math.floor(Math.random() * 20) + 1,
    difficulty: difficulties[i % difficulties.length],
    category: categories[i % categories.length],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }))
}

// Navigation functions
const goToPage = (page) => {
  if (page >= 1 && page <= pagination.totalPages && page !== pagination.currentPage) {
    fetchQuestions(page)
  }
}

const getVisiblePages = () => {
  const current = pagination.currentPage
  const total = pagination.totalPages
  const pages = []
  
  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    // Show pages around current page
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    // Always show last page
    if (!pages.includes(total)) {
      pages.push(total)
    }
  }
  
  return pages
}

// Action functions
const editQuestion = (questionId) => {
  console.log(`Navigating to edit question ${questionId}`)
  // In a real app: this.$router.push(`/admin/questions/${questionId}/edit`)
}

const deleteQuestion = async (questionId) => {
  if (confirm('Are you sure you want to delete this question?')) {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Refresh the current page
        await fetchQuestions(pagination.currentPage)
        console.log('Question deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }
}

const createNewQuestion = () => {
  console.log('Navigating to create new question')
  // In a real app: this.$router.push('/admin/questions/new')
}

const refreshQuestions = () => {
  fetchQuestions(pagination.currentPage)
}

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  console.log('Logged out')
  // Navigate to login page
}

// Utility functions
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatQuestionType = (type) => {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getQuestionTypeColor = (type) => {
  const colors = {
    'multiple-choice': 'bg-blue-100 text-blue-800',
    'true-false': 'bg-green-100 text-green-800',
    'short-answer': 'bg-yellow-100 text-yellow-800',
    'code': 'bg-purple-100 text-purple-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const getDifficultyColor = (difficulty) => {
  const colors = {
    'easy': 'text-green-600',
    'medium': 'text-yellow-600',
    'hard': 'text-red-600'
  }
  return colors[difficulty] || 'text-gray-600'
}

// Initialize component
onMounted(() => {
  fetchDashboardStats()
  fetchQuestions()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
