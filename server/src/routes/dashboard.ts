import { Router, Response } from 'express'
import StudyPlan from '../models/StudyPlan'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const plans = await StudyPlan.find({ userId: req.userId })
    const upcomingTasks = plans.reduce((sum, p) => sum + p.tasks.filter((t) => !t.completed).length, 0)
    const tasksCompleted = plans.reduce((sum, p) => sum + p.tasks.filter((t) => t.completed).length, 0)
    res.json({ upcomingTasks, plansCreated: plans.length, tasksCompleted })
  } catch {
    res.status(500).json({ message: 'Failed to fetch dashboard data' })
  }
})

export default router
