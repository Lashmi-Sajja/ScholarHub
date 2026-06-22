import mongoose, { Document, Schema, Types } from 'mongoose'

interface ITask {
  day: number
  subject: string
  description: string
  duration: number
  completed: boolean
}

export interface IStudyPlan extends Document {
  userId: Types.ObjectId
  title: string
  subjects: { name: string; deadline: Date }[]
  availableHoursPerDay: number
  tasks: ITask[]
  generatedAt: Date
}

const studyPlanSchema = new Schema<IStudyPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  subjects: [{ name: String, deadline: Date }],
  availableHoursPerDay: { type: Number, required: true },
  tasks: [{
    day: Number,
    subject: String,
    description: String,
    duration: Number,
    completed: { type: Boolean, default: false },
  }],
  generatedAt: { type: Date, default: Date.now },
})

export default mongoose.model<IStudyPlan>('StudyPlan', studyPlanSchema)
