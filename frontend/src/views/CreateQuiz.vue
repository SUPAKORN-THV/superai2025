<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create New Quiz</h1>
      <p class="text-gray-600 mt-2">Generate AI-powered quiz questions or create your own</p>
    </div>

    <!-- AI Connection Status -->
    <div v-if="aiStatus" class="mb-6">
      <div :class="[
        'p-4 rounded-lg border',
        aiStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      ]">
        <div class="flex items-center">
          <svg v-if="aiStatus.success" class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span :class="aiStatus.success ? 'text-green-800' : 'text-red-800'">
            {{ aiStatus.message }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Quiz Configuration -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm border sticky top-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quiz Configuration</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                v-model="quizConfig.title"
                type="text"
                :class="[
                  'form-input',
                  validationErrors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                ]"
                placeholder="Enter quiz title"
                required
              />
              <p v-if="validationErrors.title" class="text-red-500 text-sm mt-1">{{ validationErrors.title }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="quizConfig.description"
                rows="3"
                class="form-input"
                placeholder="Describe what this quiz covers"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Language *</label>
              <select 
                v-model="quizConfig.language" 
                :class="[
                  'form-input',
                  validationErrors.language ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                ]"
                required
              >
                <option value="">Select Language</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
              </select>
              <p v-if="validationErrors.language" class="text-red-500 text-sm mt-1">{{ validationErrors.language }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select v-model="quizConfig.difficulty" class="form-input">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <input
                v-model="quizConfig.category"
                type="text"
                :class="[
                  'form-input',
                  validationErrors.category ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                ]"
                placeholder="e.g., Fundamentals, Algorithms"
                required
              />
              <p v-if="validationErrors.category" class="text-red-500 text-sm mt-1">{{ validationErrors.category }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                v-model.number="quizConfig.timeLimit"
                type="number"
                min="5"
                max="180"
                class="form-input"
              />
            </div>

            <!-- AI Generation Settings -->
            <div v-if="activeTab === 'ai'" class="border-t pt-4">
              <h3 class="text-sm font-medium text-gray-900 mb-3">AI Generation Settings</h3>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Topic/Subject *</label>
                  <input
                    v-model="aiConfig.topic"
                    type="text"
                    :class="[
                      'form-input',
                      validationErrors.topic ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    placeholder="e.g., JavaScript Arrays, Python Functions"
                  />
                  <p v-if="validationErrors.topic" class="text-red-500 text-sm mt-1">{{ validationErrors.topic }}</p>
                  <p class="text-gray-500 text-xs mt-1">Enter at least 4 characters to describe the quiz topic</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                  <select v-model="aiConfig.questionCount" class="form-input">
                    <option value="3">3 Questions</option>
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                  </select>
                </div>
              </div>

              <button
                @click="generateQuestionsDirectly"
                :disabled="!canGenerateDirectly || generating"
                class="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 transition duration-300"
              >
                <span v-if="generating">Generating...</span>
                <span v-else>Generate Questions</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="border-b">
            <nav class="flex space-x-8 px-6">
              <button
                @click="switchTab('ai')"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'ai'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                AI Generation
              </button>
              <button
                @click="switchTab('manual')"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'manual'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Manual Creation
              </button>
              <button
                @click="switchTab('preview')"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'preview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Preview ({{ questions.length }})
              </button>
            </nav>
          </div>

          <div class="p-6">
            <!-- AI Generation Tab -->
            <div v-if="activeTab === 'ai'" class="space-y-6">
              <div v-if="!showAIChat">
                <div class="text-center py-8">
                  <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">AI-Powered Quiz Creation</h3>
                  <p class="text-gray-600 mb-6">
                    Choose your method: Upload documents and chat with AI, or generate questions directly from topics
                  </p>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div class="text-center p-4 bg-blue-50 rounded-lg">
                      <svg class="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <h4 class="font-medium text-gray-900">Upload & Chat</h4>
                      <p class="text-sm text-gray-600">Upload files and chat with AI</p>
                    </div>
                    
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                      <svg class="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <h4 class="font-medium text-gray-900">Direct Generation</h4>
                      <p class="text-sm text-gray-600">Generate from topics instantly</p>
                    </div>
                    
                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                      <svg class="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <h4 class="font-medium text-gray-900">Smart Questions</h4>
                      <p class="text-sm text-gray-600">AI creates targeted questions</p>
                    </div>
                  </div>
                  
                  <div class="flex justify-center space-x-4">
                    <button
                      @click="createChatSession"
                      class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 font-medium"
                    >
                      Start AI Chat Session
                    </button>
                    
                    <button
                      @click="testAIConnection"
                      :disabled="testingConnection"
                      class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition duration-300 font-medium"
                    >
                      <span v-if="testingConnection">Testing...</span>
                      <span v-else>Test AI Connection</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-else class="h-[600px]">
                <ChatInterface
                  :session-id="chatSessionId"
                  :quiz-config="quizConfig"
                  @quiz-generated="handleQuizGenerated"
                  @content-extracted="handleContentExtracted"
                />
              </div>
            </div>

            <!-- Manual Creation Panel -->
            <div v-if="activeTab === 'manual'" class="space-y-6">
              <div class="border rounded-lg p-4">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Question</h3>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                    <select v-model="newQuestion.type" class="form-input">
                      <option value="single-choice">Single Choice</option>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="free-text">Free Text</option>
                      <option value="code">Code</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    <textarea
                      v-model="newQuestion.question"
                      rows="3"
                      class="form-input"
                      placeholder="Enter your question"
                    ></textarea>
                  </div>
                  
                  <!-- Options for choice questions -->
                  <div v-if="['single-choice', 'multiple-choice'].includes(newQuestion.type)">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div class="space-y-2">
                      <div v-for="(option, index) in newQuestion.options" :key="index" class="flex items-center space-x-2">
                        <input
                          v-model="newQuestion.options[index]"
                          type="text"
                          class="form-input flex-1"
                          :placeholder="`Option ${index + 1}`"
                        />
                        <button
                          @click="removeOption(index)"
                          class="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <button
                        @click="addOption"
                        class="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                    <input
                      v-model="newQuestion.correctAnswer"
                      type="text"
                      class="form-input"
                      placeholder="Enter the correct answer"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                    <textarea
                      v-model="newQuestion.explanation"
                      rows="2"
                      class="form-input"
                      placeholder="Explain why this is the correct answer"
                    ></textarea>
                  </div>
                  
                  <button
                    @click="addQuestion"
                    :disabled="!isQuestionValid"
                    class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition duration-300"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </div>

            <!-- Preview Panel -->
            <div v-if="activeTab === 'preview'" class="space-y-6">
              <div v-if="questions.length === 0" class="text-center py-8">
                <p class="text-gray-500">No questions added yet</p>
                <p class="text-sm text-gray-400 mt-2">Use AI generation or manual creation to add questions</p>
              </div>
              
              <div v-else class="space-y-4">
                <div
                  v-for="(question, index) in questions"
                  :key="index"
                  class="border rounded-lg p-4"
                >
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="font-medium text-gray-900">Question {{ index + 1 }}</h4>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                        {{ question.type }}
                      </span>
                      <button
                        @click="removeQuestion(index)"
                        class="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <p class="text-gray-700 mb-3">{{ question.question }}</p>
                  
                  <div v-if="question.options && question.options.length > 0" class="mb-3">
                    <div class="space-y-1">
                      <div
                        v-for="(option, optIndex) in question.options"
                        :key="optIndex"
                        class="text-sm text-gray-600"
                      >
                        {{ String.fromCharCode(65 + optIndex) }}. {{ option }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-sm">
                    <span class="font-medium text-green-600">Correct Answer:</span>
                    {{ question.correctAnswer }}
                  </div>
                  
                  <div v-if="question.explanation" class="text-sm text-gray-600 mt-2">
                    <span class="font-medium">Explanation:</span>
                    {{ question.explanation }}
                  </div>
                </div>
                
                <div class="pt-6 border-t">
                  <button
                    @click="saveQuiz"
                    :disabled="!canSaveQuiz || saving"
                    class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition duration-300"
                  >
                    <span v-if="saving">Saving Quiz...</span>
                    <span v-else>Save Quiz ({{ questions.length }} questions)</span>
                  </button>
                </div>
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
import { useRouter } from 'vue-router'
import api from '../services/api'
import ChatInterface from '../components/chat/ChatInterface.vue'

const router = useRouter()

const activeTab = ref('ai')
const questions = ref([])
const generating = ref(false)
const saving = ref(false)
const testingConnection = ref(false)
const aiStatus = ref(null)

const quizConfig = ref({
  title: '',
  description: '',
  language: '',
  difficulty: 'beginner',
  category: '',
  timeLimit: 30
})

const aiConfig = ref({
  topic: '',
  questionCount: 5,
  questionTypes: ['single-choice', 'multiple-choice']
})

const newQuestion = ref({
  type: 'single-choice',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
  difficulty: 'beginner',
  points: 1
})

const chatSessionId = ref(null)
const showAIChat = ref(false)
const extractedContent = ref('')
const validationErrors = ref({})

const validateFields = () => {
  const errors = {}
  
  if (!quizConfig.value.title.trim()) {
    errors.title = 'Quiz title is required'
  }
  
  if (!quizConfig.value.language) {
    errors.language = 'Please select a programming language'
  }
  
  if (!quizConfig.value.category.trim()) {
    errors.category = 'Category is required'
  }
  
  if (activeTab.value === 'ai' && aiConfig.value.topic.trim().length < 4) {
    errors.topic = 'Topic must be at least 4 characters long'
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const canGenerateDirectly = computed(() => {
  return quizConfig.value.language && 
         quizConfig.value.difficulty && 
         aiConfig.value.topic.trim().length > 3
})

const isQuestionValid = computed(() => {
  const q = newQuestion.value
  return q.question.trim() && 
         q.correctAnswer.trim() && 
         (q.type === 'free-text' || q.type === 'code' || q.options.filter(o => o.trim()).length >= 2)
})

const canSaveQuiz = computed(() => {
  return quizConfig.value.title.trim() &&
         quizConfig.value.language &&
         quizConfig.value.category.trim() &&
         questions.value.length > 0
})

const switchTab = (tab) => {
  activeTab.value = tab
}

const testAIConnection = async () => {
  testingConnection.value = true
  aiStatus.value = null
  
  try {
    const response = await api.get('/api/ai/test-connection')
    aiStatus.value = {
      success: true,
      message: 'AI connection is working properly'
    }
    console.log('✅ AI connection test passed:', response.data)
  } catch (error) {
    aiStatus.value = {
      success: false,
      message: `AI connection failed: ${error.response?.data?.message || error.message}`
    }
    console.error('❌ AI connection test failed:', error)
  } finally {
    testingConnection.value = false
  }
}

const generateQuestionsDirectly = async () => {
  if (!validateFields()) {
    return
  }

  generating.value = true
  
  try {
    console.log('🎯 Generating questions directly with config:', {
      topic: aiConfig.value.topic,
      language: quizConfig.value.language,
      difficulty: quizConfig.value.difficulty,
      questionCount: aiConfig.value.questionCount
    })

    const response = await api.post('/api/ai/generate-quiz', {
      topic: aiConfig.value.topic,
      language: quizConfig.value.language,
      difficulty: quizConfig.value.difficulty,
      questionCount: parseInt(aiConfig.value.questionCount),
      questionTypes: aiConfig.value.questionTypes
    })
    
    if (response.data.success && response.data.questions) {
      questions.value = [...questions.value, ...response.data.questions]
      activeTab.value = 'preview'
      
      // Auto-fill quiz title if empty
      if (!quizConfig.value.title) {
        quizConfig.value.title = `${aiConfig.value.topic} - ${quizConfig.value.language} Quiz`
      }
      
      console.log(`✅ Generated ${response.data.questions.length} questions`)
    } else {
      throw new Error(response.data.message || 'Invalid response format')
    }
  } catch (error) {
    console.error('❌ Failed to generate questions:', error)
    alert(`Failed to generate questions: ${error.response?.data?.message || error.message}`)
  } finally {
    generating.value = false
  }
}

const addOption = () => {
  newQuestion.value.options.push('')
}

const removeOption = (index) => {
  newQuestion.value.options.splice(index, 1)
}

const addQuestion = () => {
  const question = {
    ...newQuestion.value,
    options: newQuestion.value.options.filter(o => o.trim())
  }
  
  questions.value.push(question)
  
  // Reset form
  newQuestion.value = {
    type: 'single-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'beginner',
    points: 1
  }
  
  activeTab.value = 'preview'
}

const removeQuestion = (index) => {
  questions.value.splice(index, 1)
}

const saveQuiz = async () => {
  if (!validateFields() || questions.value.length === 0) {
    if (questions.value.length === 0) {
      alert('Please add at least one question to the quiz')
    }
    return
  }

  saving.value = true
  
  try {
    const quizData = {
      ...quizConfig.value,
      questions: questions.value
    }
    
    console.log('💾 Saving quiz:', quizData)
    
    const response = await api.post('/api/quizzes', quizData)
    
    if (response.data && response.data._id) {
      console.log('✅ Quiz saved successfully:', response.data._id)
      router.push(`/quiz/${response.data._id}`)
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (error) {
    console.error('❌ Failed to save quiz:', error)
    alert(`Failed to save quiz: ${error.response?.data?.message || error.message}`)
  } finally {
    saving.value = false
  }
}

const createChatSession = async () => {
  try {
    console.log('🚀 Creating chat session...')
    
    const response = await api.post('/api/chat/sessions', {
      title: `Quiz Creation - ${quizConfig.value.title || 'Untitled'}`,
      context: {
        topic: quizConfig.value.category,
        language: quizConfig.value.language,
        difficulty: quizConfig.value.difficulty
      }
    })
    
    if (!response.data || !response.data._id) {
      throw new Error('Invalid response from server')
    }
    
    chatSessionId.value = response.data._id
    showAIChat.value = true
    
    console.log('✅ Chat session created:', response.data._id)
  } catch (error) {
    console.error('❌ Failed to create chat session:', error)
    alert(`Failed to start AI chat: ${error.response?.data?.message || error.message}`)
  }
}

const handleQuizGenerated = (generatedQuestions) => {
  console.log('🎉 Received generated questions:', generatedQuestions.length)
  questions.value = [...questions.value, ...generatedQuestions]
  activeTab.value = 'preview'
}

const handleContentExtracted = (context) => {
  extractedContent.value = context.extractedContent || ''
  console.log('📄 Content extracted:', extractedContent.value.length, 'characters')
}

onMounted(() => {
  // Test AI connection when component mounts
  testAIConnection()
})
</script>

<script>
export default {
  components: {
    ChatInterface
  }
}
</script>
