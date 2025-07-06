<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white p-4">
      <h2 class="text-2xl font-semibold mb-4">Quiz Designer</h2>
      <ul>
        <li class="mb-2">
          <a href="#" class="hover:text-gray-300">Dashboard</a>
        </li>
        <li class="mb-2">
          <a href="#" class="hover:text-gray-300">Create Quiz</a>
        </li>
        <li class="mb-2">
          <a href="#" class="hover:text-gray-300">Settings</a>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900">Quiz Creation</h1>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-4 sm:px-0">
            <!-- Chat Interface -->
            <div class="rounded-lg shadow-lg overflow-hidden">
              <!-- Chat Header -->
              <div class="bg-gray-200 border-b border-gray-300 p-4">
                <h3 class="text-lg font-semibold text-gray-700">
                  AI Quiz Generator
                </h3>
              </div>

              <!-- Chat Messages -->
              <div
                class="p-4 h-96 overflow-y-auto"
                ref="chatContainer"
                @DOMSubtreeModified="scrollToBottom"
              >
                <div
                  v-for="message in chatMessages"
                  :key="message.id"
                  class="mb-2"
                  :class="{
                    'text-right': message.sender === 'user',
                    'text-left': message.sender === 'assistant',
                  }"
                >
                  <div
                    class="inline-block rounded-lg p-3"
                    :class="{
                      'bg-indigo-100 text-indigo-800':
                        message.sender === 'assistant',
                      'bg-blue-100 text-blue-800': message.sender === 'user',
                    }"
                  >
                    {{ message.content }}
                    <div class="text-xs text-gray-500 mt-1">
                      {{ formatTime(message.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- File Upload Section -->
              <div class="p-4 border-t border-gray-200 bg-gray-50">
                <div class="mb-4">
                  <h3 class="text-sm font-medium text-gray-700 mb-2">
                    Upload Documents for OCR
                  </h3>

                  <!-- Drag and Drop Area -->
                  <div
                    @drop.prevent="handleFileDrop"
                    @dragover.prevent="fileUpload.isDragging = true"
                    @dragleave.prevent="fileUpload.isDragging = false"
                    @dragenter.prevent
                    class="relative border-2 border-dashed rounded-lg p-6 text-center transition-colors"
                    :class="
                      fileUpload.isDragging
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    "
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*,application/pdf"
                      @change="handleFileSelect"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div v-if="!fileUpload.isUploading" class="space-y-2">
                      <svg
                        class="mx-auto h-8 w-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <div class="text-sm text-gray-600">
                        <span
                          class="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                          Click to upload
                        </span>
                        or drag and drop
                      </div>
                      <p class="text-xs text-gray-500">
                        Images and PDF files up to 10MB
                      </p>
                    </div>

                    <!-- Loading Spinner -->
                    <div v-else class="flex flex-col items-center space-y-2">
                      <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                      ></div>
                      <p class="text-sm text-gray-600">Processing document...</p>
                    </div>
                  </div>

                  <!-- File Preview -->
                  <div
                    v-if="
                      fileUpload.selectedFile && !fileUpload.isUploading
                    "
                    class="mt-3 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        <span class="text-sm font-medium text-gray-900">{{
                          fileUpload.selectedFile.name
                        }}</span>
                        <span class="text-xs text-gray-500">({{
                          formatFileSize(fileUpload.selectedFile.size)
                        }})</span>
                      </div>
                      <button
                        @click="clearFile"
                        class="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Extracted Text Preview -->
                <div
                  v-if="fileUpload.showPreview && fileUpload.extractedText"
                  class="space-y-3"
                >
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-gray-700">
                      Extracted Text
                    </h4>
                    <button
                      @click="fileUpload.showPreview = false"
                      class="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Hide Preview
                    </button>
                  </div>

                  <textarea
                    v-model="fileUpload.extractedText"
                    rows="6"
                    readonly
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    placeholder="Extracted text will appear here..."
                  ></textarea>

                  <div class="flex flex-col sm:flex-row gap-2">
                    <button
                      @click="insertToLesson"
                      class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Insert to Lesson
                    </button>
                    <button
                      @click="copyToClipboard"
                      class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Copy Text
                    </button>
                  </div>
                </div>
              </div>

              <!-- Chat Input Form -->
              <div class="bg-gray-100 border-t border-gray-300 p-4">
                <form @submit.prevent="sendMessage" class="flex items-center">
                  <input
                    type="text"
                    v-model="newMessage"
                    placeholder="Type your message..."
                    class="flex-1 rounded-l-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 sm:text-sm border-gray-300"
                  />
                  <button
                    type="submit"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md transition duration-300"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  setup() {
    const newMessage = ref('')
    const chatMessages = ref([])
    const chatContainer = ref(null)
    const fileInput = ref(null)

    const fileUpload = reactive({
      isDragging: false,
      isUploading: false,
      extractedText: '',
      selectedFile: null,
      showPreview: false,
    })

    const sendMessage = () => {
      if (newMessage.value.trim() !== '') {
        chatMessages.value.push({
          id: Date.now(),
          sender: 'user',
          content: newMessage.value,
          timestamp: new Date(),
        })
        newMessage.value = ''

        // Simulate AI response
        setTimeout(() => {
          chatMessages.value.push({
            id: Date.now(),
            sender: 'assistant',
            content: 'This is a simulated AI response.',
            timestamp: new Date(),
          })
        }, 1000)
      }
    }

    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }

    const scrollToBottom = () => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    }

    onMounted(() => {
      scrollToBottom()
    })

    const handleFileDrop = (event) => {
      fileUpload.isDragging = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        processFile(files[0])
      }
    }

    const handleFileSelect = (event) => {
      const files = event.target.files
      if (files.length > 0) {
        processFile(files[0])
      }
    }

    const processFile = async (file) => {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
      ]
      if (!allowedTypes.includes(file.type)) {
        alert('Please select an image or PDF file.')
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.')
        return
      }

      fileUpload.selectedFile = file
      fileUpload.isUploading = true
      fileUpload.extractedText = ''
      fileUpload.showPreview = false

      try {
        const formData = new FormData()
        formData.append('file', file)

        // Get JWT token from localStorage (simulating auth store)
        const token = localStorage.getItem('authToken')

        const response = await fetch('/api/ocr', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        fileUpload.extractedText =
          data.text || 'No text could be extracted from this document.'
        fileUpload.showPreview = true

        // Add success message to chat
        chatMessages.value.push({
          id: Date.now(),
          sender: 'assistant',
          content: `Successfully extracted text from "${file.name}". You can now review and insert the content into your lesson.`,
          timestamp: new Date(),
        })
      } catch (error) {
        console.error('OCR processing failed:', error)

        // Add error message to chat
        chatMessages.value.push({
          id: Date.now(),
          sender: 'assistant',
          content: `Sorry, I couldn't process the file "${file.name}". Please try again or use a different file format.`,
          timestamp: new Date(),
        })

        // Mock extracted text for demo purposes
        fileUpload.extractedText = `Mock extracted text from ${file.name}:\n\nThis is sample text that would be extracted from your document using OCR technology. In a real implementation, this would contain the actual text content from your uploaded image or PDF file.`
        fileUpload.showPreview = true
      } finally {
        fileUpload.isUploading = false
      }
    }

    const clearFile = () => {
      fileUpload.selectedFile = null
      fileUpload.extractedText = ''
      fileUpload.showPreview = false
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const insertToLesson = () => {
      if (fileUpload.extractedText) {
        newMessage.value =
          newMessage.value +
          (newMessage.value ? '\n\n' : '') +
          fileUpload.extractedText
        fileUpload.showPreview = false

        // Add confirmation message to chat
        chatMessages.value.push({
          id: Date.now(),
          sender: 'assistant',
          content:
            'Text has been inserted into your message composer. You can now edit and send it to generate questions.',
          timestamp: new Date(),
        })
      }
    }

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(fileUpload.extractedText)

        // Add confirmation message to chat
        chatMessages.value.push({
          id: Date.now(),
          sender: 'assistant',
          content: 'Text copied to clipboard successfully!',
          timestamp: new Date(),
        })
      } catch (error) {
        console.error('Failed to copy text:', error)
      }
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return {
      newMessage,
      chatMessages,
      sendMessage,
      formatTime,
      chatContainer,
      scrollToBottom,
      fileUpload,
      handleFileDrop,
      handleFileSelect,
      processFile,
      clearFile,
      insertToLesson,
      copyToClipboard,
      formatFileSize,
      fileInput,
    }
  },
}
</script>
