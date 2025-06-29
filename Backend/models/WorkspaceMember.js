import mongoose from 'mongoose';

const workspaceMemberSchema = new mongoose.Schema({
  workspaceId: { type: String, ref: 'Workspace', required: true },
  userId: { type: String, ref: 'User', required: true },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Member'], 
  },
  addedBy: { type: String, ref: 'User' },
  addedAt: { type: Date, default: Date.now },
}, { timestamps: true });

workspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

export default mongoose.model('WorkspaceMember', workspaceMemberSchema);
