import mongoose from 'mongoose';

const projectMemberSchema = new mongoose.Schema({
  projectId: { type: String, ref: 'Project', required: true },
  userId: { type: String, ref: 'User', required: true },
  role: {
    type: String,
    required: true,
    enum: ['Admin','Manager', 'Collaborator', 'Viewer'], 
  },
  addedBy: { type: String, ref: 'User' },
  addedAt: { type: Date, default: Date.now },
}, { timestamps: true });

projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export default mongoose.model('ProjectMember', projectMemberSchema);
