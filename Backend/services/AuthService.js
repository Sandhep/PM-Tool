import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Utils from '../utils/Utils.js';
import UserRepository from '../repositories/UserRepository.js';
import InvitationRepository from '../repositories/InvitationRepository.js';

dotenv.config();

class AuthService {

  async register({ name, email, password }) {

    const userExists = await UserRepository.findByEmail(email);
    
    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserRepository.create({
      name:name,
      email:email,
      passwordHash: hashedPassword,
    })
  
    return newUser; 
  }

  async login({ email, password }) {

    const user = await UserRepository.findByEmail(email);
          
    if (!user) {
      throw new Error("User Not Found");  
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role[0] },
       process.env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' }
    );

    return { message: 'Login successful', token };
  }

  async inviteUser(dataObject){

    try{

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs
      const acceptUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

      const mailObject = {
        subject : "You've been invited to join a project",
        receiverEmail: dataObject.email,
        heading : "Welcome to the PM Tool",
        message : `Click the link to accept invitation: ${acceptUrl}`
      }

      await Utils.sendEmail(mailObject);

      const invitation = await InvitationRepository.create({
        email: dataObject.email,
        projectId: dataObject.projectId,
        invitedBy: dataObject.invitedBy,
        token: token,
        role: dataObject.role,
        expiresAt: expiresAt
      });

      return invitation;

    } catch (error) {
      throw new Error("Invite failed: " + error.message);
    }
  }

}

export default new AuthService();