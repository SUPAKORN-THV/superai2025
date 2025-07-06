<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Student Dashboard</h1>
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
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Completed Quizzes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.completedQuizzes }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Average Score</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.averageScore }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Study Time</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.studyTime }}h</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Attempts Table -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Past Quiz Attempts</h2>
          <button 
            @click="startNewQuiz"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            New Quiz
          </button>
        </div>

        <div v-if="isLoading" class="p-6">
          <div class="animate-pulse">
            <div class="space-y-3">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>

        <div v-else-if="quizAttempts.length === 0" class="p-6 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No quiz attempts</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by taking your first quiz.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="attempt in quizAttempts" :key="attempt.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ attempt.quizTitle }}</div>
                  <div class="text-sm text-gray-500">{{ attempt.category }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{{ attempt.score }}%</div>
                    <div class="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300"
                        :class="getScoreColor(attempt.score)"
                        :style="{ width: `${attempt.score}%` }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(attempt.completedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ attempt.duration }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusColor(attempt.status)"
                  >
                    {{ attempt.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="viewResults(attempt)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    View Results
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const user = reactive({
  name: 'John Doe',
  email: 'john@example.com'
})

const stats = reactive({
  completedQuizzes: 12,
  averageScore: 85,
  studyTime: 24
})

const isLoading = ref(true)
const quizAttempts = ref([])

// Mock data
const mockQuizAttempts = [
  {
    id: 1,
    quizTitle: 'JavaScript Fundamentals',
    category: 'Programming',
    score: 92,
    completedAt: '2024-01-15T10:30:00Z',
    duration: '15 min',
    status: 'Completed'
  },
  {
    id: 2,
    quizTitle: 'Vue.js Basics',
    category: 'Frontend',
    score: 78,
    completedAt: '2024-01-14T14:20:00Z',
    duration: '20 min',
    status: 'Completed'
  },
  {
    id: 3,
    quizTitle: 'CSS Grid Layout',
    category: 'Styling',
    score: 88,
    completedAt: '2024-01-13T09:15:00Z',
    duration: '12 min',
    status: 'Completed'
  }
]

const fetchUserData = async () => {
  try {
    // Simulate API call to /api/auth/me
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock response
    quizAttempts.value = mockQuizAttempts
  } catch (error) {
    console.error('Error fetching user data:', error)
  } finally {
    isLoading.value = false
  }
}

const startNewQuiz = () => {
  console.log('Starting new quiz...')
  // Navigate to quiz selection or quiz taking page
}

const viewResults = (attempt) => {
  console.log('Viewing results for:', attempt.quizTitle)
  // Navigate to detailed results page
}

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  console.log('Logged out')
  // Navigate to login page
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getScoreColor = (score) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'Failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  fetchUserData()
})
</script>