<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Welcome back, {{ authStore.user?.username }}!
      </h1>
      <p class="text-gray-600 mt-2">
        Track your progress and continue your learning journey
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Quizzes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalQuizzes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Average Score</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.averageScore }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Time Spent</p>
            <p class="text-2xl font-semibold text-gray-900">{{ formatTime(stats.totalTimeSpent) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Current Streak</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.streak }} days</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Quiz Attempts -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-6 border-b">
            <h2 class="text-lg font-semibold text-gray-900">Recent Quiz Attempts</h2>
          </div>
          <div class="p-6">
            <div v-if="recentAttempts.length === 0" class="text-center py-8">
              <p class="text-gray-500">No quiz attempts yet</p>
              <router-link
                to="/quizzes"
                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                Take Your First Quiz
              </router-link>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="attempt in recentAttempts"
                :key="attempt._id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 class="font-medium text-gray-900">{{ attempt.quiz.title }}</h3>
                  <p class="text-sm text-gray-600">
                    {{ attempt.quiz.language }} • {{ attempt.quiz.difficulty }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(attempt.completedAt) }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-lg font-semibold" :class="getScoreColor(attempt.percentage)">
                    {{ attempt.percentage }}%
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ formatTime(attempt.timeSpent) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <router-link
              to="/quizzes"
              class="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Browse Quizzes
            </router-link>
            <router-link
              to="/create-quiz"
              class="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
            >
              Create Quiz
            </router-link>
            <router-link
              to="/profile"
              class="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
            >
              Edit Profile
            </router-link>
          </div>
        </div>

        <!-- Achievements -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
          <div v-if="achievements.length === 0" class="text-center py-4">
            <p class="text-gray-500 text-sm">No achievements yet</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="achievement in achievements.slice(0, 3)"
              :key="achievement.name"
              class="flex items-center space-x-3"
            >
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span class="text-yellow-600 text-sm">🏆</span>
              </div>
              <div>
                <p class="font-medium text-gray-900 text-sm">{{ achievement.name }}</p>
                <p class="text-xs text-gray-600">{{ achievement.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const authStore = useAuthStore()
const recentAttempts = ref([])
const loading = ref(true)

const stats = computed(() => authStore.user?.stats || {
  totalQuizzes: 0,
  averageScore: 0,
  totalTimeSpent: 0,
  streak: 0
})

const achievements = computed(() => authStore.user?.achievements || [])

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getScoreColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const fetchRecentAttempts = async () => {
  try {
    const response = await api.get('/api/users/quiz-attempts?limit=5')
    recentAttempts.value = response.data
  } catch (error) {
    console.error('Failed to fetch recent attempts:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecentAttempts()
})
</script>
