import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  projectId: { type: String, required: true },
  invitedBy: { type: String, ref: 'User', required: true },
  role: { type: String, enum: ['Developer', 'Tester', 'Manager'], default: 'Developer' },
  token: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Expired'], default: 'Pending' },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model('Invitation', invitationSchema);
