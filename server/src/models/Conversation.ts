import mongoose, { Document, Schema, Types } from 'mongoose'

interface IMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface IConversation extends Document {
  userId: Types.ObjectId
  messages: IMessage[]
  createdAt: Date
}

const conversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IConversation>('Conversation', conversationSchema)
