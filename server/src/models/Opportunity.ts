import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IOpportunity extends Document {
  title: string
  type: 'hackathon' | 'internship' | 'scholarship' | 'competition'
  description: string
  url: string
  deadline: Date
  bookmarkedBy: Types.ObjectId[]
  createdAt: Date
}

const opportunitySchema = new Schema<IOpportunity>({
  title: { type: String, required: true },
  type: { type: String, enum: ['hackathon', 'internship', 'scholarship', 'competition'], required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  deadline: { type: Date, required: true },
  bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IOpportunity>('Opportunity', opportunitySchema)
