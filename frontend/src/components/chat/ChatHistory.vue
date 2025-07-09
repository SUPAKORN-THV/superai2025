<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Chat History</h3>
      <button
        @click="refreshSessions"
        :disabled="loading"
        class="text-gray-500 hover:text-gray-700"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="sessions.length === 0" class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-4">💬</div>
      <p class="text-gray-500">No chat sessions yet</p>
      <p class="text-sm text-gray-400 mt-2">Start a new chat to create quizzes with AI</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="session in sessions"
        :key="session._id"
        class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition duration-300"
        @click="$emit('select-session', session._id)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-medium text-gray-900 mb-1">{{ session.title }}</h4>
            <p class="text-sm text-gray-600 mb-2">{{ session.lastMessage }}</p>
            <div class="flex items-center space-x-4 text-xs text-gray-500">
              <span>{{ session.messageCount }} messages</span>
              <span>{{ formatDate(session.updatedAt) }}</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span
              :class="[
                'w-2 h-2 rounded-full',
                session.isActive ? 'bg-green-400' : 'bg-gray-300'
              ]"
            ></span>
            
            <button
              @click.stop="deleteSession(session._id)"
              class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChatService from '../../services/chatService'

const emit = defineEmits(['select-session'])

const sessions = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Today'
  if (diffDays === 2) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const refreshSessions = async () => {
  loading.value = true
  try {
    sessions.value = await ChatService.getSessions()
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
  } finally {
    loading.value = false
  }
}

const deleteSession = async (sessionId) => {
  if (!confirm('Are you sure you want to delete this chat session?')) {
    return
  }

  try {
    await ChatService.deleteSession(sessionId)
    sessions.value = sessions.value.filter(s => s._id !== sessionId)
  } catch (error) {
    console.error('Failed to delete session:', error)
    alert('Failed to delete session. Please try again.')
  }
}

onMounted(() => {
  refreshSessions()
})
</script>
