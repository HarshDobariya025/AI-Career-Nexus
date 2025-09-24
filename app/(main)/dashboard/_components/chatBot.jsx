"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react"
import { chatBot } from "@/actions/chatBot"

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Career Coach. Ask me anything about your career development, industry trends, or job market insights.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: "user", content: input.trim(), timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await chatBot(input.trim())
      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Animation variants
  const chatPanelVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        duration: 0.3,
      },
    },
  }

  const messageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3,
      },
    },
  }

  const buttonVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      rotate: -5,
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const typingVariants = {
    typing: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <>
      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-[30vw] z-50"
          >
            <Card className="h-full rounded-none border-l shadow-2xl bg-background/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div variants={pulseVariants} animate="pulse" className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/ai-coach-avatar.png" alt="AI Coach" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                  <div>
                    <CardTitle className="text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      AI Career Coach
                    </CardTitle>
                    <motion.p
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Online • Ready to help
                    </motion.p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </CardHeader>

              <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
                {/* Messages Area */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          className={`flex items-start space-x-2 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                            >
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80">
                                  <Bot className="h-4 w-4 text-primary-foreground" />
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                          )}

                          <motion.div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm relative overflow-hidden ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                                : "bg-gradient-to-r from-muted to-muted/80 border"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {message.role === "assistant" && (
                              <motion.div
                                className="absolute top-1 right-1 opacity-20"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              >
                                <Sparkles className="h-3 w-3" />
                              </motion.div>
                            )}
                            <motion.p
                              className="whitespace-pre-wrap"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {message.content}
                            </motion.p>
                            <motion.p
                              className={`text-xs mt-1 opacity-70 ${
                                message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.7 }}
                              transition={{ delay: 0.4 }}
                            >
                              {formatTime(message.timestamp)}
                            </motion.p>
                          </motion.div>

                          {message.role === "user" && (
                            <motion.div
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                            >
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isLoading && (
                      <motion.div
                        className="flex items-start space-x-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          className="bg-gradient-to-r from-muted to-muted/80 rounded-lg px-3 py-2 text-sm border"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-primary rounded-full"
                                variants={typingVariants}
                                animate="typing"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <motion.div
                  className="border-t p-4 bg-gradient-to-r from-background to-muted/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <motion.div
                      className="flex-1"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me about your career..."
                        disabled={isLoading}
                        className="flex-1 border-2 focus:border-primary/50 transition-all duration-200"
                      />
                    </motion.div>
                    <motion.div variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                      >
                        <motion.div
                          animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                          transition={
                            isLoading ? { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" } : {}
                          }
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary relative overflow-hidden"
          size="icon"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification dot */}
          {!isOpen && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 500 }}
            >
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </Button>
      </motion.div>
    </>
  )
}
