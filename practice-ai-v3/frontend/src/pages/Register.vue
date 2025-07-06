<template>
  <div class="absolute top-4 left-4">
    <button @click="$router.push('/')" class="text-indigo-600 hover:text-indigo-500 focus:outline-none">
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
  </div>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <RouterLink to="/" class="text-indigo-600 hover:text-indigo-500 transition-colors">
            <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </RouterLink>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Join our learning platform and start your journey
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div class="mt-1 relative">
              <input
                id="name"
                name="name"
                type="text"
                autocomplete="name"
                required
                v-model="form.name"
                :disabled="loading"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-500': errors.name,
                  'pr-10': errors.name 
                }"
                placeholder="Enter your full name"
                @blur="handleBlur('name')"
              />
              <div v-if="errors.name" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div class="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="form.email"
                :disabled="loading"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-500': errors.email,
                  'pr-10': errors.email 
                }"
                placeholder="Enter your email address"
                @blur="handleBlur('email')"
              />
              <div v-if="errors.email" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                v-model="form.password"
                :disabled="loading"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed pr-10"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-500': errors.password 
                }"
                placeholder="Create a strong password"
                @blur="handleBlur('password')"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :disabled="loading"
                class="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            <div class="mt-2">
              <div class="text-xs text-gray-500">
                Password must be at least 8 characters long
              </div>
              <div class="mt-1 flex space-x-1">
                <div 
                  v-for="(requirement, index) in passwordRequirements" 
                  :key="index"
                  class="flex items-center text-xs"
                  :class="requirement.met ? 'text-green-600' : 'text-gray-400'"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="requirement.met" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    <circle v-else cx="12" cy="12" r="10" stroke-width="2"></circle>
                  </svg>
                  {{ requirement.text }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Registration Failed
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="loading" class="animate-spin h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </span>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Have an account?
            <RouterLink 
              to="/login" 
              class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Log in
            </RouterLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const form = reactive({
  name: '',
  email: '',
  password: ''
})

// Component state
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// Form validation
const errors = reactive({
  name: '',
  email: '',
  password: ''
})

// Password requirements
const passwordRequirements = computed(() => [
  {
    text: '8+ chars',
    met: form.password.length >= 8
  },
  {
    text: 'Uppercase',
    met: /[A-Z]/.test(form.password)
  },
  {
    text: 'Number',
    met: /\d/.test(form.password)
  }
])

// Form validation
const isFormValid = computed(() => {
  return form.name.trim() !== '' && 
         form.email.trim() !== '' && 
         form.password.length >= 8 &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
})

// Validate individual fields
const validateField = (field) => {
  errors[field] = ''
  
  switch (field) {
    case 'name':
      if (!form.name.trim()) {
        errors.name = 'Name is required'
      } else if (form.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters'
      }
      break
      
    case 'email':
      if (!form.email.trim()) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
      }
      break
      
    case 'password':
      if (!form.password) {
        errors.password = 'Password is required'
      } else if (form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
      }
      break
  }
}

// Handle form submission
const handleSubmit = async () => {
  // Clear previous errors
  errorMessage.value = ''
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Validate all fields
  Object.keys(form).forEach(validateField)
  
  // Check if there are any validation errors
  if (Object.values(errors).some(error => error !== '')) {
    return
  }
  
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all required fields correctly'
    return
  }
  
  loading.value = true
  
  try {
    await authStore.register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password
    })
    
    // Redirect to dashboard on successful registration
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific error messages
    if (error.message.includes('email already exists') || error.message.includes('already registered')) {
      errorMessage.value = 'An account with this email already exists. Please try logging in instead.'
    } else if (error.message.includes('password')) {
      errorMessage.value = 'Password does not meet requirements. Please choose a stronger password.'
    } else if (error.message.includes('validation')) {
      errorMessage.value = 'Please check your information and try again.'
    } else {
      errorMessage.value = error.message || 'Registration failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

// Real-time validation
const handleBlur = (field) => {
  validateField(field)
}
</script>
