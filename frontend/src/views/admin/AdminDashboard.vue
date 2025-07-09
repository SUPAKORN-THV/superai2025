<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600 mt-2">Manage users, quizzes, and system statistics</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Quizzes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalQuizzes || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Attempts</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalAttempts || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Today</p>
            <p class="text-2xl font-semibold text-gray-900">{{ activeToday || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="border-b">
        <nav class="flex space-x-8 px-6">
          <button
            @click="activeTab = 'users'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Users
          </button>
          <button
            @click="activeTab = 'quizzes'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'quizzes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Quizzes
          </button>
          <button
            @click="activeTab = 'analytics'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'analytics'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Analytics
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Users Tab -->
        <div v-if="activeTab === 'users'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">User Management</h2>
            <div class="flex items-center space-x-4">
              <input
                v-model="userSearch"
                type="text"
                placeholder="Search users..."
                class="form-input w-64"
              />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quizzes
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user._id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-sm font-medium">
                          {{ user.username.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      ]"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.stats?.totalQuizzes || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      v-if="user.role === 'admin'"
                      @click="showRoleModal(user)"
                      class="text-orange-600 hover:text-orange-900 mr-4"
                    >
                      Revoke Admin
                    </button>
                    <button
                      v-else
                      @click="showAddModal(user)"
                      class="text-green-600 hover:text-green-900 mr-4"
                    >
                      Make Admin
                    </button>
                    <button
                      @click="showDeleteModal(user)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quizzes Tab -->
        <div v-if="activeTab === 'quizzes'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Quiz Management</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="quiz in quizzes"
              :key="quiz._id"
              class="bg-gray-50 p-6 rounded-lg border"
            >
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ quiz.title }}</h3>
                <div class="flex space-x-2">
                  <router-link
                    :to="`/edit-quiz/${quiz._id}`"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="showQuizDeleteModal(quiz)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div class="space-y-2 text-sm text-gray-600">
                <div>Language: {{ quiz.language }}</div>
                <div>Difficulty: {{ quiz.difficulty }}</div>
                <div>Questions: {{ quiz.questions?.length || 0 }}</div>
                <div>Attempts: {{ quiz.totalAttempts || 0 }}</div>
                <div>Created by: {{ quiz.createdBy?.username || 'Unknown' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">System Analytics</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Popular Languages</h3>
              <div class="space-y-3">
                <div
                  v-for="lang in stats.languageStats"
                  :key="lang._id"
                  class="flex items-center justify-between"
                >
                  <span class="text-gray-700 capitalize">{{ lang._id }}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600">{{ lang.count }} quizzes</span>
                    <div class="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-indigo-600 h-2 rounded-full"
                        :style="{ width: `${(lang.count / Math.max(...stats.languageStats.map(l => l.count))) * 100}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
              <div class="space-y-3">
                <div
                  v-for="user in stats.recentUsers"
                  :key="user._id"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span class="text-white text-xs font-medium">
                        {{ user.username.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <span class="text-gray-700">{{ user.username }}</span>
                  </div>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmModal
      :show="showModal"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :confirm-text="modalConfig.confirmText"
      :requires-input="modalConfig.requiresInput"
      :input-placeholder="modalConfig.inputPlaceholder"
      :expected-input="modalConfig.expectedInput"
      @confirm="handleModalConfirm"
      @cancel="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'
import ConfirmModal from '../../components/ConfirmModal.vue'

const activeTab = ref('users')
const stats = ref({})
const users = ref([])
const quizzes = ref([])
const userSearch = ref('')
const loading = ref(true)

const activeToday = computed(() => {
  // This would be calculated based on recent activity
  return Math.floor(Math.random() * 50) + 10
})

const showModal = ref(false)
const modalConfig = ref({})
const selectedUser = ref(null)
const selectedQuiz = ref(null)

const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  
  return users.value.filter(user =>
    user.username.toLowerCase().includes(userSearch.value.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.value.toLowerCase())
  )
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const fetchStats = async () => {
  try {
    const response = await api.get('/api/admin/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  }
}

const fetchUsers = async () => {
  try {
    const response = await api.get('/api/admin/users')
    users.value = response.data.users || []
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/admin/quizzes')
    quizzes.value = response.data.quizzes || []
  } catch (error) {
    console.error('Failed to fetch quizzes:', error)
  }
}
const showAddModal = (user) => {
  selectedUser.value = user
  modalConfig.value = {
    title: 'Add Admin Privileges',
    message: `Are you sure you want to add admin privileges from <strong>"${user.username}"</strong>?<br><br>
              <strong>Current role:</strong> ${user.role}<br>
              <strong>New role:</strong> Admin<br><br>
              This action will add admin privileges and system access.`,
    confirmText: 'Add Admin',
    requiresInput: false
  }
  showModal.value = true
}

const showRoleModal = (user) => {
  selectedUser.value = user
  modalConfig.value = {
    title: 'Revoke Admin Privileges',
    message: `Are you sure you want to revoke admin privileges from <strong>"${user.username}"</strong>?<br><br>
              <strong>Current role:</strong> ${user.role}<br>
              <strong>New role:</strong> user<br><br>
              This action will remove their admin privileges and system access.`,
    confirmText: 'Revoke Admin',
    requiresInput: false
  }
  showModal.value = true
}

const toggleUserRole = async () => {
  const user = selectedUser.value
  try {
    await api.put(`/api/admin/users/${user._id}/role`, { role: 'user' })
    user.role = 'user'
    alert(`Successfully revoked admin privileges from ${user.username}`)
  } catch (error) {
    console.error('Failed to update user role:', error)
    alert('Failed to update user role')
  }
  showModal.value = false
}

const toggleAdminRole = async () => {
  const user = selectedUser.value
  try {
    await api.put(`/api/admin/users/${user._id}/role`, { role: 'admin' })
    user.role = 'admin'
    alert(`Successfully add admin privileges from ${user.username}`)
  } catch (error) {
    console.error('Failed to update admin role:', error)
    alert('Failed to update admin role')
  }
  showModal.value = false
}

const showDeleteModal = (user) => {
  selectedUser.value = user
  modalConfig.value = {
    title: '⚠️ Delete User Permanently',
    message: `Are you sure you want to permanently delete user <strong>"${user.username}"</strong>?<br><br>
              <strong>User details:</strong><br>
              • Email: ${user.email}<br>
              • Role: ${user.role}<br>
              • Joined: ${formatDate(user.createdAt)}<br>
              • Total Quizzes: ${user.stats?.totalQuizzes || 0}<br><br>
              <strong>This action CANNOT be undone and will:</strong><br>
              • Delete all user data permanently<br>
              • Remove all their quiz attempts<br>
              • Delete any quizzes they created<br><br>
              Type the username <strong>"${user.username}"</strong> to confirm deletion.`,
    confirmText: 'Delete User',
    requiresInput: true,
    inputPlaceholder: `Type "${user.username}" to confirm`,
    expectedInput: user.username
  }
  showModal.value = true
}

const deleteUser = async () => {
  const user = selectedUser.value
  try {
    await api.delete(`/api/admin/users/${user._id}`)
    users.value = users.value.filter(u => u._id !== user._id)
    alert(`User "${user.username}" has been permanently deleted.`)
  } catch (error) {
    console.error('Failed to delete user:', error)
    alert('Failed to delete user')
  }
  showModal.value = false
}

const showQuizDeleteModal = (quiz) => {
  selectedQuiz.value = quiz
  modalConfig.value = {
    title: '⚠️ Delete Quiz Permanently',
    message: `Are you sure you want to permanently delete quiz <strong>"${quiz.title}"</strong>?<br><br>
              <strong>Quiz details:</strong><br>
              • Language: ${quiz.language}<br>
              • Difficulty: ${quiz.difficulty}<br>
              • Questions: ${quiz.questions?.length || 0}<br>
              • Total Attempts: ${quiz.totalAttempts || 0}<br>
              • Created by: ${quiz.createdBy?.username || 'Unknown'}<br><br>
              <strong>This action CANNOT be undone and will:</strong><br>
              • Delete the quiz permanently<br>
              • Remove all attempt records<br>
              • Affect user statistics`,
    confirmText: 'Delete Quiz',
    requiresInput: false
  }
  showModal.value = true
}

const deleteQuiz = async () => {
  const quiz = selectedQuiz.value
  try {
    await api.delete(`/api/admin/quizzes/${quiz._id}`)
    quizzes.value = quizzes.value.filter(q => q._id !== quiz._id)
    alert(`Quiz "${quiz.title}" has been permanently deleted.`)
  } catch (error) {
    console.error('Failed to delete quiz:', error)
    alert('Failed to delete quiz')
  }
  showModal.value = false
}

const handleModalConfirm = () => {
  if (selectedUser.value && modalConfig.value.title.includes('Delete User')) {
    deleteUser()
  } else if (selectedUser.value && modalConfig.value.title.includes('Revoke Admin')) {
    toggleUserRole()
  } else if (selectedUser.value && modalConfig.value.title.includes('Add Admin')) {
    toggleAdminRole()
  } else if (selectedQuiz.value) {
    deleteQuiz()
  }
}

onMounted(async () => {
  await Promise.all([
    fetchStats(),
    fetchUsers(),
    fetchQuizzes()
  ])
  loading.value = false
})
</script>
