import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const projectSchema = new mongoose.Schema({
  projectId: { type: String, default: uuidv4, unique: true, index: true },
  name: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
  ownerId: { type: String, ref: 'User', required: true },
  parentProjectId : {type: String , ref : 'Project'},
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
