<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
      <p class="text-gray-600 mt-2">Manage your account information and preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  v-model="profileForm.firstName"
                  type="text"
                  class="form-input"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  v-model="profileForm.lastName"
                  type="text"
                  class="form-input"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                v-model="profileForm.username"
                type="text"
                class="form-input"
                disabled
                readonly
              />
              <p class="text-sm text-gray-500 mt-1">Username cannot be changed</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="form-input"
                disabled
                readonly
              />
              <p class="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                v-model="profileForm.bio"
                rows="4"
                class="form-input"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Languages</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div v-for="language in availableLanguages" :key="language" class="flex items-center">
                  <input
                    :id="language"
                    v-model="profileForm.preferredLanguages"
                    :value="language"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label :for="language" class="ml-2 text-sm text-gray-700 capitalize">
                    {{ language }}
                  </label>
                </div>
              </div>
            </div>
            
            <div v-if="updateMessage" class="text-center">
              <p :class="updateSuccess ? 'text-green-600' : 'text-red-600'">
                {{ updateMessage }}
              </p>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="updating"
                class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition duration-300"
              >
                <span v-if="updating">Updating...</span>
                <span v-else>Update Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Profile Stats -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Member since</span>
              <span class="font-medium">{{ formatDate(authStore.user?.createdAt) }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Total quizzes</span>
              <span class="font-medium">{{ authStore.user?.stats?.totalQuizzes || 0 }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Average score</span>
              <span class="font-medium">{{ authStore.user?.stats?.averageScore || 0 }}%</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Current streak</span>
              <span class="font-medium">{{ authStore.user?.stats?.streak || 0 }} days</span>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          
          <div v-if="achievements.length === 0" class="text-center py-4">
            <p class="text-gray-500 text-sm">No achievements yet</p>
            <p class="text-gray-400 text-xs mt-1">Complete quizzes to earn achievements</p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="achievement in achievements"
              :key="achievement.name"
              class="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
            >
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span class="text-yellow-600 text-sm">🏆</span>
              </div>
              <div>
                <p class="font-medium text-gray-900 text-sm">{{ achievement.name }}</p>
                <p class="text-xs text-gray-600">{{ achievement.description }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(achievement.earnedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const profileForm = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  bio: '',
  preferredLanguages: []
})

const availableLanguages = ['javascript', 'python', 'java', 'cpp', 'html', 'css', 'sql']
const updating = ref(false)
const updateMessage = ref('')
const updateSuccess = ref(false)

const achievements = computed(() => authStore.user?.achievements || [])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadProfile = () => {
  const user = authStore.user
  if (user) {
    profileForm.value = {
      firstName: user.profile?.firstName || '',
      lastName: user.profile?.lastName || '',
      username: user.username,
      email: user.email,
      bio: user.profile?.bio || '',
      preferredLanguages: user.profile?.preferredLanguages || []
    }
  }
}

const updateProfile = async () => {
  updating.value = true
  updateMessage.value = ''
  
  try {
    await authStore.updateProfile({
      profile: {
        firstName: profileForm.value.firstName,
        lastName: profileForm.value.lastName,
        bio: profileForm.value.bio,
        preferredLanguages: profileForm.value.preferredLanguages
      }
    })
    
    updateMessage.value = 'Profile updated successfully!'
    updateSuccess.value = true
    
    setTimeout(() => {
      updateMessage.value = ''
    }, 3000)
  } catch (error) {
    updateMessage.value = error.message || 'Failed to update profile'
    updateSuccess.value = false
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>
