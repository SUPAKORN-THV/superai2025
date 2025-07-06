<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">LearnHub</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="navigateToLogin"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </button>
            <button 
              @click="navigateToRegister"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div class="text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
          Master New Skills with
          <span class="text-indigo-600">Interactive Quizzes</span>
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join thousands of learners who are advancing their careers through our comprehensive quiz platform. 
          Test your knowledge, track your progress, and achieve your learning goals.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            @click="startLearning"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Start Learning
          </button>
          <button class="text-indigo-600 hover:text-indigo-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Watch Demo
          </button>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-6 bg-white rounded-xl shadow-sm">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Interactive Learning</h3>
          <p class="text-gray-600">Engage with dynamic quizzes and real-time feedback to enhance your learning experience.</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-xl shadow-sm">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
          <p class="text-gray-600">Monitor your learning journey with detailed analytics and performance insights.</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-xl shadow-sm">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Expert Content</h3>
          <p class="text-gray-600">Access curated content created by industry experts and experienced educators.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '../router'

const startLearning = () => {
  // Navigate to registration or login
  console.log('Starting learning journey...')
  router.push('/register')
}

const navigateToLogin = () => {
  // Navigate to login page
  console.log('Navigating to login...')
  // Redirect to login page
  router.push('/login')
}

const navigateToRegister = () => {
  // Navigate to registration page
  console.log('Navigating to register...')
  router.push('/register')
}
</script>