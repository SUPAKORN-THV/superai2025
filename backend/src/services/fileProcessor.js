import pdf from "pdf-parse"
import sharp from "sharp"
import Tesseract from "tesseract.js"
import mammoth from "mammoth"
import fs from "fs/promises"

export class FileProcessor {
  static async processFile(file) {
    try {
      const { mimetype, path, originalname } = file
      let extractedText = ""
      let processedData = {}

      switch (mimetype) {
        case "application/pdf":
          extractedText = await this.processPDF(path)
          break
        case "image/jpeg":
        case "image/png":
        case "image/jpg":
          extractedText = await this.processImage(path)
          break
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          extractedText = await this.processDocx(path)
          break
        case "text/plain":
          extractedText = await this.processText(path)
          break
        default:
          throw new Error(`Unsupported file type: ${mimetype}`)
      }

      processedData = {
        filename: originalname,
        mimetype,
        extractedText: extractedText.trim(),
        wordCount: extractedText.split(/\s+/).length,
        size: file.size,
      }

      // Clean up uploaded file
      await fs.unlink(path).catch(() => {})

      return processedData
    } catch (error) {
      console.error("File processing error:", error)
      throw new Error(`Failed to process file: ${error.message}`)
    }
  }

  static async processPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath)
      const data = await pdf(dataBuffer)
      return data.text
    } catch (error) {
      throw new Error(`PDF processing failed: ${error.message}`)
    }
  }

  static async processImage(filePath) {
    try {
      // Optimize image for OCR
      const optimizedBuffer = await sharp(filePath)
        .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
        .grayscale()
        .normalize()
        .sharpen()
        .toBuffer()

      const {
        data: { text },
      } = await Tesseract.recognize(optimizedBuffer, "eng", {
        logger: (m) => console.log(m),
      })

      return text
    } catch (error) {
      throw new Error(`Image OCR failed: ${error.message}`)
    }
  }

  static async processDocx(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath })
      return result.value
    } catch (error) {
      throw new Error(`DOCX processing failed: ${error.message}`)
    }
  }

  static async processText(filePath) {
    try {
      return await fs.readFile(filePath, "utf-8")
    } catch (error) {
      throw new Error(`Text file processing failed: ${error.message}`)
    }
  }

  static validateFile(file) {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not supported`)
    }

    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit")
    }

    return true
  }
}
