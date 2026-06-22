import { Router, Response } from 'express'
import Opportunity from '../models/Opportunity'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const opportunities = await Opportunity.find().sort({ createdAt: -1 }).lean()
    const data = opportunities.map((opp) => ({
      ...opp,
      bookmarked: opp.bookmarkedBy.some((id) => id.toString() === req.userId),
      bookmarkedBy: undefined,
    }))
    res.json(data)
  } catch {
    res.status(500).json({ message: 'Failed to fetch opportunities' })
  }
})

router.post('/:id/bookmark', async (req: AuthRequest, res: Response) => {
  try {
    const opp = await Opportunity.findById(req.params.id)
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' })
    if (!opp.bookmarkedBy.some((id) => id.toString() === req.userId)) {
      opp.bookmarkedBy.push(req.userId as any)
      await opp.save()
    }
    res.json({ message: 'Bookmarked' })
  } catch {
    res.status(500).json({ message: 'Failed to bookmark' })
  }
})

router.delete('/:id/bookmark', async (req: AuthRequest, res: Response) => {
  try {
    const opp = await Opportunity.findById(req.params.id)
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' })
    opp.bookmarkedBy = opp.bookmarkedBy.filter((id) => id.toString() !== req.userId)
    await opp.save()
    res.json({ message: 'Unbookmarked' })
  } catch {
    res.status(500).json({ message: 'Failed to unbookmark' })
  }
})

export default router
