import mongoose from 'mongoose';
import log from '../utils/Logger.js';
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ MongoDB connected');
  log.info('Connected with MongoDB');
};

export default connectDB;
