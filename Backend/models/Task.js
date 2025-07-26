import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const taskSchema = new mongoose.Schema({
  taskId: { type: String, default: uuidv4, unique: true, index: true },
  name: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  startDate: { type: Date },
  endDate: { type: Date },
  eta: { type: Number },
  projectId: { type: String, ref: 'Project', required: true },
  assignerId: { type: String, ref: 'User', required: true },
  assigneeId: { type: String, ref: 'User', default: null },
  parentTaskId: {type: String, ref: 'Task', default: null} 
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
