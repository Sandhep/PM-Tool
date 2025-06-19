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

  async register(registerUserDTO) {
    const userExists = await UserRepository.findByEmail(registerUserDTO.email);

    if (userExists) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(registerUserDTO.password, 10);

    const newUser = await UserRepository.create({
      name: registerUserDTO.name,
      email: registerUserDTO.email,
      passwordHash: hashedPassword,
    });

    await MailService.sendOnboardMail(registerUserDTO.email, registerUserDTO.name);
    return newUser;
  }

  async login(loginUserDTO) {
    const user = await UserRepository.findByEmail(loginUserDTO.email);

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    const isPasswordValid = await bcrypt.compare(loginUserDTO.password, user.passwordHash);

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

  async inviteUser(inviteUserDTO) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs

    await MailService.sendInviteMail(inviteUserDTO, token);

    const invitation = await InvitationRepository.create({
      email: inviteUserDTO.email,
      projectId: inviteUserDTO.projectId,
      invitedBy: inviteUserDTO.invitedBy,
      token,
      role: inviteUserDTO.role,
      expiresAt,
    });

    return invitation;
  }

  async acceptInvitation(acceptInviteDTO) {
    const invite = await InvitationRepository.findByStatus(acceptInviteDTO.token, 'Pending');

    if (!invite || invite.expiresAt < new Date()) {
      throw new BadRequestException("Invitation expired or invalid");
    }

    let user = await UserRepository.findByEmail(invite.email);

    if (!user) {
      user = await this.register({
        name: acceptInviteDTO.name,
        email: invite.email,
        password: acceptInviteDTO.password
      });
    }

    // TODO: Add user to project
    // await ProjectService.addUserToProject(user._id, invite.projectId, invite.role);

    await InvitationRepository.updateStatus(acceptInviteDTO.token, 'Accepted');

    return user;
  }
}

export default new AuthService();
