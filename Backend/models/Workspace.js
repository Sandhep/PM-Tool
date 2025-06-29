import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const workspaceSchema = new mongoose.Schema({
  workspaceId: { type: String, default: uuidv4, unique: true, index: true },
  name: { type: String, required: true },
  description: String,
  ownerId: { type: String, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Workspace', workspaceSchema);
