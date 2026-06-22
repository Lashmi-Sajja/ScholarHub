import { Router, Response } from 'express'
import StudyPlan from '../models/StudyPlan'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { generatePlan } from '../services/gemini'

const router = Router()
router.use(authMiddleware)

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { subjects, availableHoursPerDay } = req.body
    if (!subjects?.length || !availableHoursPerDay) {
      return res.status(400).json({ message: 'Subjects and availableHoursPerDay are required' })
    }
    const planData = await generatePlan(subjects, availableHoursPerDay)
    const plan = await StudyPlan.create({
      userId: req.userId,
      title: `Study Plan - ${new Date().toLocaleDateString()}`,
      subjects,
      availableHoursPerDay,
      tasks: planData.tasks,
    })
    res.status(201).json({ _id: plan._id, title: plan.title })
  } catch (err) {
    console.error('Create plan error:', err)
    res.status(500).json({ message: 'Failed to create plan' })
  }
})

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const plans = await StudyPlan.find({ userId: req.userId })
      .select('title generatedAt')
      .sort({ generatedAt: -1 })
    res.json(plans)
  } catch {
    res.status(500).json({ message: 'Failed to fetch plans' })
  }
})

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.userId })
    if (!plan) return res.status(404).json({ message: 'Plan not found' })
    res.json(plan)
  } catch {
    res.status(500).json({ message: 'Failed to fetch plan' })
  }
})

router.patch('/:id/tasks/:taskId', async (req: AuthRequest, res: Response) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.userId })
    if (!plan) return res.status(404).json({ message: 'Plan not found' })
    const task = (plan.tasks as any).id(req.params.taskId)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    task.completed = !task.completed
    await plan.save()
    res.json(plan)
  } catch {
    res.status(500).json({ message: 'Failed to update task' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!plan) return res.status(404).json({ message: 'Plan not found' })
    res.json({ message: 'Plan deleted' })
  } catch {
    res.status(500).json({ message: 'Failed to delete plan' })
  }
})

export default router
