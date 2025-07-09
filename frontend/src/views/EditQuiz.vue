<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Edit Quiz</h1>
      <p class="text-gray-600 mt-2">Modify your quiz questions and settings</p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading quiz...</p>
    </div>

    <div v-else-if="quiz" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Quiz Configuration -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm border sticky top-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quiz Settings</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                v-model="quiz.title"
                type="text"
                class="form-input"
                placeholder="Enter quiz title"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="quiz.description"
                rows="3"
                class="form-input"
                placeholder="Describe what this quiz covers"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Language *</label>
              <select v-model="quiz.language" class="form-input" required>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select v-model="quiz.difficulty" class="form-input">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <input
                v-model="quiz.category"
                type="text"
                class="form-input"
                placeholder="e.g., Fundamentals, Algorithms"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                v-model.number="quiz.timeLimit"
                type="number"
                min="5"
                max="180"
                class="form-input"
              />
            </div>

            <div class="pt-4 border-t">
              <button
                @click="saveQuiz"
                :disabled="saving"
                class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition duration-300"
              >
                <span v-if="saving">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions List -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="border-b">
            <nav class="flex space-x-8 px-6">
              <button
                @click="activeTab = 'questions'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'questions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Questions ({{ quiz.questions.length }})
              </button>
              <button
                @click="activeTab = 'ai-generate'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'ai-generate'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                AI Generator
              </button>
              <button
                @click="activeTab = 'ai-chat'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'ai-chat'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                AI Chat
              </button>
            </nav>
          </div>

          <div class="p-6">
            <!-- Questions Tab -->
            <div v-if="activeTab === 'questions'">
              <div v-if="quiz.questions.length === 0" class="text-center py-8">
                <p class="text-gray-500">No questions in this quiz</p>
              </div>
              
              <div v-else class="space-y-4">
                <div
                  v-for="(question, index) in quiz.questions"
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
                        @click="editQuestion(index)"
                        class="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
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
              </div>
            </div>
            
            <!-- AI Generator Tab -->
            <div v-if="activeTab === 'ai-generate'" class="space-y-6">
              <div class="bg-blue-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">AI Question Generator</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                    <input
                      v-model="aiConfig.topic"
                      type="text"
                      class="form-input"
                      placeholder="e.g., Advanced JavaScript Concepts"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                    <select v-model="aiConfig.questionCount" class="form-input">
                      <option value="3">3 Questions</option>
                      <option value="5">5 Questions</option>
                      <option value="10">10 Questions</option>
                    </select>
                  </div>
                </div>
                
                <button
                  @click="generateQuestions"
                  :disabled="generating || !aiConfig.topic"
                  class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition duration-300"
                >
                  <span v-if="generating">Generating...</span>
                  <span v-else>Generate Questions</span>
                </button>
              </div>
            </div>
            
            <!-- AI Chat Tab -->
            <div v-if="activeTab === 'ai-chat'" class="h-[600px]">
              <ChatInterface
                v-if="chatSessionId"
                :session-id="chatSessionId"
                :quiz-config="quiz"
                @quiz-generated="handleQuizGenerated"
              />
              <div v-else class="flex items-center justify-center h-full">
                <button
                  @click="createChatSession"
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Start AI Chat Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Question Modal -->
    <div v-if="editingQuestion !== null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Edit Question {{ editingQuestion + 1 }}</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <textarea
              v-model="editForm.question"
              rows="3"
              class="form-input"
              placeholder="Enter your question"
            ></textarea>
          </div>
          
          <div v-if="['single-choice', 'multiple-choice'].includes(editForm.type)">
            <label class="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div class="space-y-2">
              <input
                v-for="(option, index) in editForm.options"
                :key="index"
                v-model="editForm.options[index]"
                type="text"
                class="form-input"
                :placeholder="`Option ${index + 1}`"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
            <input
              v-model="editForm.correctAnswer"
              type="text"
              class="form-input"
              placeholder="Enter the correct answer"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
            <textarea
              v-model="editForm.explanation"
              rows="2"
              class="form-input"
              placeholder="Explain why this is the correct answer"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="cancelEdit"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="saveQuestionEdit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import ChatInterface from '../components/chat/ChatInterface.vue'

const route = useRoute()
const router = useRouter()

const quiz = ref(null)
const loading = ref(true)
const saving = ref(false)
const editingQuestion = ref(null)
const editForm = ref({})
const activeTab = ref('questions')
const generating = ref(false)
const chatSessionId = ref(null)
const aiConfig = ref({
  topic: '',
  questionCount: 5
})

const loadQuiz = async () => {
  try {
    const response = await api.get(`/api/quizzes/${route.params.id}/edit`)
    quiz.value = response.data
  } catch (error) {
    console.error('Failed to load quiz:', error)
    if (error.response?.status === 403) {
      alert('You are not authorized to edit this quiz')
    } else {
      alert('Failed to load quiz')
    }
    router.push('/quizzes')
  } finally {
    loading.value = false
  }
}

const saveQuiz = async () => {
  saving.value = true
  try {
    await api.put(`/api/quizzes/${route.params.id}`, quiz.value)
    alert('Quiz saved successfully!')
  } catch (error) {
    console.error('Failed to save quiz:', error)
    alert('Failed to save quiz')
  } finally {
    saving.value = false
  }
}

const editQuestion = (index) => {
  editingQuestion.value = index
  editForm.value = { ...quiz.value.questions[index] }
}

const saveQuestionEdit = () => {
  quiz.value.questions[editingQuestion.value] = { ...editForm.value }
  cancelEdit()
}

const cancelEdit = () => {
  editingQuestion.value = null
  editForm.value = {}
}

const removeQuestion = (index) => {
  if (confirm('Are you sure you want to remove this question?')) {
    quiz.value.questions.splice(index, 1)
  }
}

const generateQuestions = async () => {
  generating.value = true
  try {
    const response = await api.post('/api/ai/generate-quiz', {
      topic: aiConfig.value.topic,
      language: quiz.value.language,
      difficulty: quiz.value.difficulty,
      questionCount: parseInt(aiConfig.value.questionCount)
    })
    
    if (response.data.success) {
      quiz.value.questions.push(...response.data.questions)
      activeTab.value = 'questions'
      alert(`Added ${response.data.questions.length} new questions!`)
    }
  } catch (error) {
    console.error('Failed to generate questions:', error)
    alert('Failed to generate questions')
  } finally {
    generating.value = false
  }
}

const createChatSession = async () => {
  try {
    const response = await api.post('/api/chat/sessions', {
      title: `Edit Quiz - ${quiz.value.title}`,
      context: {
        topic: quiz.value.category,
        language: quiz.value.language,
        difficulty: quiz.value.difficulty
      }
    })
    chatSessionId.value = response.data._id
  } catch (error) {
    console.error('Failed to create chat session:', error)
    alert('Failed to start AI chat')
  }
}

const handleQuizGenerated = (questions) => {
  quiz.value.questions.push(...questions)
  activeTab.value = 'questions'
  alert(`Added ${questions.length} new questions from chat!`)
}

onMounted(() => {
  loadQuiz()
})
</script>