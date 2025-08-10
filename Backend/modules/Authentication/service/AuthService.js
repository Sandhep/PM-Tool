import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import MailService from '../../Notification/service/MailService.js';
import UserRepository from '../../User/repository/UserRepository.js';

import BadRequestException from '../../../common/exceptions/BadRequestException.js';
import NotFoundException from '../../../common/exceptions/NotFoundException.js';

import log from '../../../common/utils/Logger.js';

dotenv.config();

class AuthService {

  constructor(){
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.requestOtp = this.requestOtp.bind(this);
    this.resetPasswordWithOtp = this.resetPasswordWithOtp.bind(this);
  }

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
    log.info(`New user registered : ${registerUserDTO.email}`)
    return newUser;
  }

  async login(loginUserDTO) {
    const user = await UserRepository.findByEmail(loginUserDTO.email);

    if (!user) {
      throw new NotFoundException(`User Not Found :${loginUserDTO.email}`);
    }

    const isPasswordValid = await bcrypt.compare(loginUserDTO.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException(`Invalid credentials for ${loginUserDTO.email}`);
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email},
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' }
    );
    
    log.info(`User Logged In: ${loginUserDTO.email}`);
    return { message: 'Login successful', token };
  }

  async requestOtp({ email }) {
 
    log.info(`User with email Id: ${email} requested for OTP`);
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User Not Found :${email}`);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    user.resetOtp = otp;
    user.resetOtpExpiresAt = expiry;
    await user.save();

    await MailService.sendOTPMail(email,otp);

    return { message: "OTP sent to your email" };

  }

  async resetPasswordWithOtp({ email, otp, password }) {

    log.info(`User with email Id: ${email} requested for password reset`);

    const user = await UserRepository.findByEmail(email);

    if (!user || user.resetOtp !== otp || user.resetOtpExpiresAt < new Date()) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.passwordHash = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiresAt = null;

    await user.save();

    log.info(`Password reset successful for ${email}`);
    return { message: "Password reset successful" };
  
  }


}

export default new AuthService();
