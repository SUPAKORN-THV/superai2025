import { defineStore } from "pinia"
import api from "../services/api"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
  }),

  getters: {
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post("/api/auth/login", credentials)
        const { token, user } = response.data

        this.token = token
        this.user = user
        this.isAuthenticated = true

        localStorage.setItem("token", token)
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed")
      }
    },

    async register(userData) {
      try {
        const response = await api.post("/api/auth/register", userData)
        const { token, user } = response.data

        this.token = token
        this.user = user
        this.isAuthenticated = true

        localStorage.setItem("token", token)
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || "Registration failed")
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
    },

    async checkAuth() {
      if (!this.token) return

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
        const response = await api.get("/api/auth/me")

        this.user = response.data
        this.isAuthenticated = true
      } catch (error) {
        console.error("Auth check failed:", error)
        this.logout()
      }
    },

    async updateProfile(profileData) {
      try {
        const response = await api.put("/api/users/profile", profileData)
        this.user = { ...this.user, ...response.data }
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || "Profile update failed")
      }
    },
  },
})
