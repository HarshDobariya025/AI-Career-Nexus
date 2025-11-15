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
    // Get user context for personalized responses
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    })

    if (!user) throw new Error("User not found")

    //Create a context-aware prompt for the AI Career Coach
    const contextualPrompt = `
      You are an AI Career Coach assistant. The user is in the ${user.industry} industry.
      
      User's question: ${prompt}
      
      Please provide helpful, professional career advice. Keep responses concise but informative.
      Focus on actionable insights related to their industry and career development.
      
      If the question is about salary, skills, or market trends, you can reference that they're in the ${user.industry} industry.
    `

    const result = await model.generateContent(contextualPrompt)
    const response = result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error("ChatBot error:", error)
    return error
  }
}
