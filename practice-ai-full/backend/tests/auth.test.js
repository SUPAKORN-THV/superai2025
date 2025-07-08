import request from "supertest"
import app from "../src/server.js"
import User from "../src/models/User.js"

describe("Authentication", () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body).toHaveProperty("token")
      expect(response.body.user.username).toBe(userData.username)
      expect(response.body.user.email).toBe(userData.email)
    })

    it("should not register user with invalid email", async () => {
      const userData = {
        username: "testuser",
        email: "invalid-email",
        password: "password123",
      }

      await request(app).post("/api/auth/register").send(userData).expect(400)
    })
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const user = new User({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      })
      await user.save()
    })

    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(200)

      expect(response.body).toHaveProperty("token")
      expect(response.body.user.email).toBe(loginData.email)
    })

    it("should not login with invalid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      }

      await request(app).post("/api/auth/login").send(loginData).expect(401)
    })
  })
})
