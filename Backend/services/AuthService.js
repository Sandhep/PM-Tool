import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Utils from '../utils/Utils.js';
import MailService from './MailService.js';
import UserRepository from '../repositories/UserRepository.js';
import InvitationRepository from '../repositories/InvitationRepository.js';
import BadRequestException from '../exceptions/BadRequestException.js';
import NotFoundException from '../exceptions/NotFoundException.js';

dotenv.config();

class AuthService {

  async register({ name, email, password }) {

    const userExists = await UserRepository.findByEmail(email);
    
    if (userExists) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserRepository.create({
      name:name,
      email:email,
      passwordHash: hashedPassword,
    })

    MailService.sendOnboardMail(email,name);
  
    return newUser; 
  }

  async login({ email, password }) {

    const user = await UserRepository.findByEmail(email);
          
    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role[0] },
       process.env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' }
    );

    return { message: 'Login successful', token };
  }

  async inviteUser(dataObject){

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs

      await MailService.sendInviteMail(dataObject,token);

      const invitation = await InvitationRepository.create({
        email: dataObject.email,
        projectId: dataObject.projectId,
        invitedBy: dataObject.invitedBy,
        token: token,
        role: dataObject.role,
        expiresAt: expiresAt
      });

      return invitation;

  }

  async acceptInvitation(dataObject){

      const invite = await InvitationRepository.findByStatus(dataObject.token,'Pending');

      if (!invite || invite.expiresAt < new Date()) {
        throw new BadRequestException("Invitation expired or invalid");
      }

      let user = await UserRepository.findByEmail(invite.email);

      if (!user) {
        user = await this.register({ name: dataObject.name, email: invite.email, password: dataObject.password });
      }

      // Add user to project
      //await AuthService.addUserToProject(user._id, invite.projectId, invite.role);

      await InvitationRepository.updateStatus(dataObject.token,'Accepted');

      return user;
  }

}

export default new AuthService();