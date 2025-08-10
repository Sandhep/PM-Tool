import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({
  userId:       { type: String, default: uuidv4, unique: true, index: true },
  name:      { type: String, required: true, trim: true, minlength: 3 },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:  { type: String, required: true },
  resetOtp: { type: String, default: null },
  resetOtpExpiresAt: { type: Date, default: null },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now }
});
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
export default mongoose.model('User', UserSchema);
