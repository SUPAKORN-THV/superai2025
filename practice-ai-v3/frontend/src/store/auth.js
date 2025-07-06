import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => {
      return state.user?.role === 'admin' || state.user?.isAdmin === true
    },
    
    userName: (state) => {
      return state.user?.name || state.user?.username || 'User'
    },
    
    userEmail: (state) => {
      return state.user?.email || ''
    }
  },

  actions: {
    // Initialize auth state from localStorage
    init() {
      const token = localStorage.getItem('authToken')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        try {
          this.token = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          this.clearAuth()
        }
      }
    },

    // Login action
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Login failed')
        }

        const data = await response.json()
        
        // Store token and user data
        this.token = data.token || data.accessToken
        this.user = data.user
        this.isAuthenticated = true
        
        // Save to localStorage
        localStorage.setItem('authToken', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Register action
    async register(payload) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorData = await response.json()
          
          // Handle specific error cases
          if (response.status === 409) {
            throw new Error('An account with this email already exists')
          } else if (response.status === 422) {
            throw new Error('Please check your information and try again')
          } else {
            throw new Error(errorData.message || 'Registration failed')
          }
        }

        const data = await response.json()
        
        // Store token and user data
        this.token = data.token || data.accessToken
        this.user = data.user
        this.isAuthenticated = true
        
        // Save to localStorage
        localStorage.setItem('authToken', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        // Initialize auth state
        this.init()
        
        return data
      } catch (error) {
        this.error = error.message
        console.error('Registration error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Logout action
    logout() {
      this.clearAuth()
    },

    // Clear authentication data
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null
      
      // Clear localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    },

    // Update user profile
    updateUser(userData) {
      this.user = { ...this.user, ...userData }
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    // Check if token is valid
    async validateToken() {
      if (!this.token) {
        return false
      }

      try {
        const response = await fetch('/api/auth/validate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          this.clearAuth()
          return false
        }

        const data = await response.json()
        if (data.user) {
          this.user = data.user
          localStorage.setItem('user', JSON.stringify(this.user))
        }

        return true
      } catch (error) {
        console.error('Token validation error:', error)
        this.clearAuth()
        return false
      }
    }
  }
})
