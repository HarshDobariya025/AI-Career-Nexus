"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

export const chatBot = async (prompt) => {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { industryInsight: true },
    })

    if (!user) throw new Error("User not found")

    // ----- UPDATED PROMPT FOR STRICT MARKDOWN BOLD SUPPORT -----
    const contextualPrompt = `
      You are a professional AI Career Coach.
      The user works in the "${user.industry}" industry.

      🟦 Response Formatting Rules:
      - Use **Markdown formatting**
      - BOLD important terms using **double asterisks** (example: **Machine Learning**)
      - NEVER escape or alter Markdown bold
      - Keep the answer short (5–7 lines)
      - Use bullet points or short paragraphs
      - No long essays

      🟦 User's Question:
      ${prompt}

      Produce a CLEAN, SHORT, MARKDOWN-FORMATTED answer with **proper bold text**.
    `

    const result = await model.generateContent(contextualPrompt)
    const response = result.response
    const text = response.text()

    return text

  } catch (error) {
    console.error("ChatBot error:", error)
    return "Something went wrong. Please try again."
  }
}
