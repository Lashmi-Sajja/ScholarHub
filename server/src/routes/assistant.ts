import { Router, Response } from 'express'
import Conversation from '../models/Conversation'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { askGemini } from '../services/gemini'

const router = Router()
router.use(authMiddleware)

router.post('/ask', async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ message: 'Message is required' })

    let conversation = await Conversation.findOne({ userId: req.userId })
    if (!conversation) {
      conversation = await Conversation.create({ userId: req.userId, messages: [] })
    }

    conversation.messages.push({ role: 'user', content: message, timestamp: new Date() })

    const reply = await askGemini(message)
    conversation.messages.push({ role: 'assistant', content: reply, timestamp: new Date() })
    await conversation.save()

    res.json({ reply })
  } catch (err) {
    console.error('Assistant error:', err)
    res.status(500).json({ message: 'Failed to get response' })
  }
})

router.get('/history', async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await Conversation.find({ userId: req.userId })
      .select('messages createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
    res.json(conversations)
  } catch {
    res.status(500).json({ message: 'Failed to fetch history' })
  }
})

export default router
