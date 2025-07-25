import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import projectMemberRoutes from './routes/projectMemberRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import apiRateLimiter from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(apiRateLimiter); // Applying Rate Limit to all Routes 

app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/project', projectRoutes);
app.use('/project/member',projectMemberRoutes);
app.use('/workspace',workspaceRoutes);
app.use('/task',taskRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error(err));


