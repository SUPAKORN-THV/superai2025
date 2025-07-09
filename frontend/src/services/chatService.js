import api from "./api"

export class ChatService {
  static async createSession(title, context = {}) {
    try {
      const response = await api.post("/api/chat/sessions", {
        title,
        context,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create chat session")
    }
  }

  static async getSessions() {
    try {
      const response = await api.get("/api/chat/sessions")
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch chat sessions")
    }
  }

  static async getSession(sessionId) {
    try {
      const response = await api.get(`/api/chat/sessions/${sessionId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch chat session")
    }
  }

  static async sendMessage(sessionId, message, files = [], context = {}) {
    try {
      const formData = new FormData()
      formData.append("message", message)
      formData.append("context", JSON.stringify(context))

      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await api.post(`/api/chat/sessions/${sessionId}/messages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to send message")
    }
  }

  static async generateQuizFromChat(sessionId, options = {}) {
    try {
      const response = await api.post(`/api/chat/sessions/${sessionId}/generate-quiz`, {
        options,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to generate quiz")
    }
  }

  static async deleteSession(sessionId) {
    try {
      const response = await api.delete(`/api/chat/sessions/${sessionId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete session")
    }
  }

  static async updateContext(sessionId, context) {
    try {
      const response = await api.put(`/api/chat/sessions/${sessionId}/context`, {
        context,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update context")
    }
  }
}

export default ChatService
