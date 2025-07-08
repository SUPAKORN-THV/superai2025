<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create New Quiz</h1>
      <p class="text-gray-600 mt-2">Generate AI-powered quiz questions or create your own</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Quiz Configuration -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm border sticky top-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quiz Configuration</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                v-model="quizConfig.title"
                type="text"
                class="form-input"
                placeholder="Enter quiz title"
              />
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select v-model="quizConfig.language" class="form-input">
                <option value="">Select Language</option>
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
              <select v-model="quizConfig.difficulty" class="form-input">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                v-model="quizConfig.category"
                type="text"
                class="form-input"
                placeholder="e.g., Fundamentals, Algorithms"
              />
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
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2">
        <!-- AI Generation Tab -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="border-b">
            <nav class="flex space-x-8 px-6">
              <button
                @click="activeTab = 'ai'"
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
                @click="activeTab = 'manual'"
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
                @click="activeTab = 'preview'"
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
            <!-- AI Generation Panel -->
            <div v-if="activeTab === 'ai'" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Topic/Lesson Content</label>
                <textarea
                  v-model="aiConfig.topic"
                  rows="6"
                  class="form-input"
                  placeholder="Describe the topic or paste lesson content here. The AI will generate questions based on this content."
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                  <input
                    v-model.number="aiConfig.questionCount"
                    type="number"
                    min="1"
                    max="20"
                    class="form-input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Question Types</label>
                  <select v-model="aiConfig.questionTypes" multiple class="form-input">
                    <option value="single-choice">Single Choice</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="code">Code Questions</option>
                  </select>
                </div>
              </div>
              
              <button
                @click="generateQuestions"
                :disabled="!canGenerate || generating"
                class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
              >
                <span v-if="generating">Generating Questions...</span>
                <span v-else>Generate Questions with AI</span>
              </button>
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
                    <span v-else>Save Quiz</span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const activeTab = ref('ai')
const questions = ref([])
const generating = ref(false)
const saving = ref(false)

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

const canGenerate = computed(() => {
  return quizConfig.value.language && 
         quizConfig.value.difficulty && 
         aiConfig.value.topic.trim().length > 10
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

const generateQuestions = async () => {
  generating.value = true
  
  try {
    const response = await api.post('/api/ai/generate-quiz', {
      topic: aiConfig.value.topic,
      language: quizConfig.value.language,
      difficulty: quizConfig.value.difficulty,
      questionCount: aiConfig.value.questionCount
    })
    
    questions.value = [...questions.value, ...response.data.questions]
    activeTab.value = 'preview'
  } catch (error) {
    console.error('Failed to generate questions:', error)
    alert('Failed to generate questions. Please try again.')
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
  saving.value = true
  
  try {
    const quizData = {
      ...quizConfig.value,
      questions: questions.value
    }
    
    const response = await api.post('/api/quizzes', quizData)
    router.push(`/quiz/${response.data._id}`)
  } catch (error) {
    console.error('Failed to save quiz:', error)
    alert('Failed to save quiz. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>
