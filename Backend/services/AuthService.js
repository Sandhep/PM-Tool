import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserRepository from '../repositories/UserRepository.js';

dotenv.config();

class AuthService {

  async register({ name, email, password }) {

    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    const userExists = await UserRepository.findByEmail(email);
    
    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserRepository.create({
      Name: name,
      Email: email,
      PasswordHash: hashedPassword,
    })
  
    return newUser; 
  }

  async login({ email, password }) {

    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const user = await UserRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
   
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userID: user.UserID, email: user.Email, role: user.Role[0] },
       process.env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' }
    );

    return { message: 'Login successful', token };
  }
}

export default new AuthService();