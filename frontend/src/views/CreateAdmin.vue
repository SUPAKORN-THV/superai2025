<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Admin Account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter the admin secret to create an administrator account
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="createAdmin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Admin username"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Admin email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Admin password"
            />
          </div>
          
          <div>
            <label for="adminSecret" class="block text-sm font-medium text-gray-700">Admin Secret</label>
            <input
              id="adminSecret"
              v-model="form.adminSecret"
              name="adminSecret"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter admin secret"
            />
            <p class="mt-1 text-sm text-gray-500">
              Admin secret: <code class="bg-gray-100 px-1 rounded">superai-admin-2024</code>
            </p>
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-600 text-sm text-center">
          {{ success }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <span v-if="loading">Creating Admin...</span>
            <span v-else>Create Admin Account</span>
          </button>
        </div>
        
        <div class="text-center">
          <router-link to="/login" class="text-indigo-600 hover:text-indigo-500">
            Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  adminSecret: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const createAdmin = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await api.post('/api/users/create-admin', form.value)
    success.value = 'Admin account created successfully! You can now login.'
    
    // Reset form
    form.value = {
      username: '',
      email: '',
      password: '',
      adminSecret: ''
    }
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create admin account'
  } finally {
    loading.value = false
  }
}
</script>
