// models/User.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({
  UserID:       { type: String, default: uuidv4, unique: true, index: true },
  Name:      { type: String, required: true, trim: true, minlength: 3 },
  Email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  PasswordHash:  { type: String, required: true },
  Role:         { type: [String], enum: ['user','admin'], default: ['user'] },
  Created_At:    { type: Date, default: Date.now },
  Updated_At:    { type: Date, default: Date.now }
});
UserSchema.pre('save', function(next) {
  this.Updated_At = Date.now();
  next();
});
export default mongoose.model('User', UserSchema);
