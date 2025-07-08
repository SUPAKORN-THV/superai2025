import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    req.userId = decoded.userId

    // Optionally fetch user data
    const user = await User.findById(decoded.userId).select("-password")
    req.user = user

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Token is not valid" })
  }
}

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {})

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    next()
  } catch (error) {
    console.error("Admin auth error:", error)
    res.status(403).json({ message: "Admin authorization failed" })
  }
}
