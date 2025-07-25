import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const invitationSchema = new mongoose.Schema({
  invitationId: { type: String, default: uuidv4, unique: true, index: true },
  email: { type: String, required: true },
  workspaceId: { type: String,ref:'Workspace', required: true },
  invitedBy: { type: String, ref: 'User', required: true },
  role: { type: String, enum:['Admin','Member'],default: 'Member' },
  token: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Expired'], default: 'Pending' },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model('Invitation', invitationSchema);
