<template>
  <nav class="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-2">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Practice-AI</h1>
          </router-link>
          
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link
              v-if="authStore.isAuthenticated"
              to="/dashboard"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/quizzes"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Quizzes
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/create-quiz"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Create Quiz
            </router-link>
            <router-link
              v-if="authStore.user?.role === 'admin'"
              to="/admin"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Admin
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
              >
                <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">
                    {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <span class="hidden md:block">{{ authStore.user?.username }}</span>
              </button>
              
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Profile
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Up
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const logout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  router.push('/')
}
</script>
