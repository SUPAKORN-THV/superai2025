<template>
  <div class="flex flex-col h-full bg-white rounded-lg shadow-sm border">
    <!-- Chat Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">AI Quiz Assistant</h3>
          <p class="text-sm text-gray-500">Upload files and chat to create quizzes</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="generateQuizFromChat"
          :disabled="!canGenerateQuiz || generatingQuiz"
          class="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 disabled:opacity-50 transition duration-300"
        >
          <span v-if="generatingQuiz">Generating...</span>
          <span v-else>Generate Quiz</span>
        </button>
        
        <button
          @click="clearChat"
          class="text-gray-500 hover:text-gray-700"
          title="Clear Chat"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="messages.length === 0" class="text-center py-8">
        <div class="text-gray-400 text-4xl mb-4">💬</div>
        <p class="text-gray-500">Start a conversation with the AI assistant</p>
        <p class="text-sm text-gray-400 mt-2">Upload files or ask questions to generate quizzes</p>
      </div>
      
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'flex',
          message.role === 'user' ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'max-w-3xl rounded-lg px-4 py-2',
            message.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          ]"
        >
          <!-- Message Content -->
          <div class="whitespace-pre-wrap">{{ message.content }}</div>
          
          <!-- Attachments -->
          <div v-if="message.attachments && message.attachments.length > 0" class="mt-2 space-y-2">
            <div
              v-for="attachment in message.attachments"
              :key="attachment.filename"
              class="flex items-center space-x-2 text-sm opacity-90"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
              <span>{{ attachment.filename }}</span>
              <span class="text-xs">({{ formatFileSize(attachment.size) }})</span>
            </div>
          </div>
          
          <!-- Timestamp -->
          <div
            :class="[
              'text-xs mt-2',
              message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
            ]"
          >
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="bg-gray-100 rounded-lg px-4 py-2">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t p-4">
      <!-- File Upload Area -->
      <div
        v-if="dragOver"
        class="border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-8 text-center mb-4"
      >
        <svg class="w-12 h-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p class="text-blue-600 font-medium">Drop files here to upload</p>
        <p class="text-sm text-blue-500">PDF, Images, Word documents, Text files</p>
      </div>
      
      <!-- Selected Files -->
      <div v-if="selectedFiles.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
          >
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
            <span>{{ file.name }}</span>
            <button
              @click="removeFile(index)"
              class="text-red-500 hover:text-red-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Message Input -->
      <div class="flex items-end space-x-2">
        <div class="flex-1">
          <textarea
            v-model="newMessage"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="newMessage += '\n'"
            @input="autoResize"
            ref="messageInput"
            placeholder="Type your message... (Shift+Enter for new line)"
            rows="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
            style="min-height: 40px; max-height: 120px; line-height: 1.5;"
          ></textarea>
        </div>
        
        <input
          ref="fileInput"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.docx,.txt"
          @change="handleFileSelect"
          class="hidden"
        />
        
        <button
          @click="$refs.fileInput.click()"
          class="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
          title="Upload files"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
          </svg>
        </button>
        
        <button
          @click="sendMessage"
          :disabled="!canSendMessage || sending"
          class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-300"
        >
          <svg v-if="sending" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import api from '../../services/api.js'

const props = defineProps({
  sessionId: String,
  onQuizGenerated: Function,
  quizConfig: Object
})

const emit = defineEmits(['quiz-generated', 'content-extracted'])

const messages = ref([])
const newMessage = ref('')
const selectedFiles = ref([])
const isTyping = ref(false)
const sending = ref(false)
const generatingQuiz = ref(false)
const dragOver = ref(false)
const messagesContainer = ref(null)
const messageInput = ref(null)

const canSendMessage = computed(() => {
  return (newMessage.value.trim() || selectedFiles.value.length > 0) && !sending.value
})

const canGenerateQuiz = computed(() => {
  return messages.value.length > 0 && !generatingQuiz.value
})

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
  event.target.value = '' // Reset input
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const sendMessage = async () => {
  if (!canSendMessage.value) return

  const messageText = newMessage.value.trim()
  const files = selectedFiles.value

  if (!messageText && files.length === 0) return

  sending.value = true
  isTyping.value = true

  try {
    console.log('💬 Sending message to session:', props.sessionId)
    
    const formData = new FormData()
    formData.append('message', messageText)
    formData.append('context', JSON.stringify(props.quizConfig || {}))

    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await api.post(`/api/chat/sessions/${props.sessionId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (!response.data) {
      throw new Error('No response data received')
    }

    const data = response.data
    
    messages.value.push(data.userMessage)
    messages.value.push(data.assistantMessage)

    // Emit content extracted event if files were uploaded
    if (files.length > 0) {
      emit('content-extracted', data.session.context)
    }

    // Clear inputs
    newMessage.value = ''
    selectedFiles.value = []
    
    // Reset textarea height
    await nextTick()
    if (messageInput.value) {
      messageInput.value.style.height = '40px'
    }

    // Scroll to bottom
    scrollToBottom()

    console.log('✅ Message sent successfully')

  } catch (error) {
    console.error('❌ Send message error:', error)
    alert(`Failed to send message: ${error.response?.data?.message || error.message}`)
  } finally {
    sending.value = false
    isTyping.value = false
  }
}

const generateQuizFromChat = async () => {
  if (!canGenerateQuiz.value) {
    alert('Please have a conversation first to generate quiz content')
    return
  }

  generatingQuiz.value = true

  try {
    console.log('🎯 Generating quiz from chat session:', props.sessionId)
    
    const response = await api.post(`/api/chat/sessions/${props.sessionId}/generate-quiz`, {
      options: props.quizConfig || {}
    })

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Failed to generate quiz')
    }

    const data = response.data
    emit('quiz-generated', data.questions)
    
    console.log('✅ Quiz generated successfully:', data.questions.length, 'questions')

  } catch (error) {
    console.error('❌ Generate quiz error:', error)
    alert(`Failed to generate quiz: ${error.response?.data?.message || error.message}`)
  } finally {
    generatingQuiz.value = false
  }
}

const clearChat = () => {
  if (confirm('Are you sure you want to clear the chat?')) {
    messages.value = []
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const autoResize = () => {
  if (messageInput.value) {
    messageInput.value.style.height = '40px'
    messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
  }
}

// Drag and drop handlers
const handleDragOver = (e) => {
  e.preventDefault()
  dragOver.value = true
}

const handleDragLeave = (e) => {
  e.preventDefault()
  dragOver.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  dragOver.value = false
  
  const files = Array.from(e.dataTransfer.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

onMounted(() => {
  // Add drag and drop listeners
  document.addEventListener('dragover', handleDragOver)
  document.addEventListener('dragleave', handleDragLeave)
  document.addEventListener('drop', handleDrop)
})

onUnmounted(() => {
  // Remove drag and drop listeners
  document.removeEventListener('dragover', handleDragOver)
  document.removeEventListener('dragleave', handleDragLeave)
  document.removeEventListener('drop', handleDrop)
})
</script>
