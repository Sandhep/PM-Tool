import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import UserRepository from '../repositories/UserRepository.js';
import InternalServerException from '../exceptions/InternalServerException.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import BadRequestException from '../exceptions/BadRequestException.js';

class MailService{

  constructor(){
    this.sendInviteMail = this.sendInviteMail.bind(this);
    this.sendOTPMail = this.sendOTPMail.bind(this);
    this.sendOTPMail = this.sendOTPMail.bind(this);
  }

    async sendEmail(mailObject) {

    dotenv.config();
    
    try {

      const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
        to: mailObject.receiverEmail,
        subject: mailObject.subject,
        html: mailObject.message
      };

      const info = await transporter.sendMail(mailOptions);

      return info;

    } catch (error) {

      throw new InternalServerException("Email sending failed: " + error.message);

    }
  }

  async sendOnboardMail(receiverEmail, name) {

    const subject = `Welcome to ${process.env.APP_NAME} - Your Project Journey Starts Here 🚀`;

    const message = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2c3e50;">Hello ${name}, welcome to <span style="color: #3498db;">PM Tool</span> !</h2>

        <p>We're excited to have you join our community. ${process.env.APP_NAME} is built to help teams collaborate, plan, and deliver projects efficiently.</p>

        <p>Here’s how you can get started:</p>

        <ul>
          <li><strong>Create or join a project</strong> to get your workspace ready.</li>
          <li><strong>Invite team members</strong> and assign roles to streamline collaboration.</li>
          <li><strong>Track your progress</strong> visually with our intuitive dashboards.</li>
        </ul>

        <p>If you need assistance at any point, our support team is just a message away — or you can explore our Help Center for quick guidance.</p>

        <p>Thank you for choosing ${process.env.APP_NAME}. We can’t wait to see what you build!</p>

        <p>Warm regards,<br/>
        <strong>The ${process.env.APP_NAME} Team</strong></p>

        <hr style="margin-top: 30px;"/>

        <small style="color: #999;">This email was sent to ${receiverEmail}. If you didn’t create an account with ${process.env.APP_NAME}, you can safely ignore this message.</small>
      </div>
    `;

    await this.sendEmail({ receiverEmail, subject, message });
  }

  async sendInviteMail(dataObject,token){

    const acceptUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;
    const invitingUser = await UserRepository.findByUserId(dataObject.invitedBy);

    if(!invitingUser){
      throw new NotFoundException("Inviting User Not Found");
    }

    if(invitingUser.email === dataObject.email){
      throw new BadRequestException("User can't invite themselves");
    }

    const message = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2c3e50;">You've been invited to join a Workspace on <span style="color: #3498db;">${process.env.APP_NAME}</span> !</h2>

        <p>Hello,</p>

        <p><strong>${invitingUser.name || "A team member"}</strong> has invited you to join a workspace as a <strong>${dataObject.role || "Member"}</strong>.</p>

        <p>To accept this invitation and get started, please click the button below:</p>

        <p style="text-align: center; margin: 30px 0;">
        <a href="${acceptUrl}" style="background-color: #3498db; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Accept Invitation
        </a>
        </p>

        <p>If the button doesn't work, you can also use the following link:</p>
        <p><a href="${acceptUrl}">${acceptUrl}</a></p>

        <p>If you weren’t expecting this email, you can safely ignore it.</p>

        <p>Looking forward to having you onboard!</p>

        <p>Warm regards,<br/>
        <strong>The ${process.env.APP_NAME} Team</strong></p>

        <hr style="margin-top: 30px;" />

        <small style="color: #999;">This invitation will expire in 24 hours. For assistance, contact our support team.</small>
    </div>
    `;

    const mailObject = {
        subject: `You're invited to join a project on ${process.env.APP_NAME}`,
        receiverEmail: dataObject.email,
        message
    };

    this.sendEmail(mailObject);

  }

  async sendOTPMail(receiverEmail,otp){

    const message = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2c3e50;">Password Reset Request</h2>

          <p>Hello,</p>

          <p>We received a request to reset your password for your <strong>${process.env.APP_NAME}</strong> account. Use the following One-Time Password (OTP) to proceed:</p>

          <p style="text-align: center; font-size: 24px; font-weight: bold; background: #f2f2f2; padding: 15px; border-radius: 8px; display: inline-block; margin: 20px 0;">
            ${otp}
          </p>

          <p>This OTP is valid for <strong>5 minutes</strong>. If you didn't request a password reset, please ignore this email. Your account remains secure.</p>

          <p>If you have any questions, feel free to reach out to our support team.</p>

          <p>Warm regards,<br/>
          <strong>The ${process.env.APP_NAME} Team</strong></p>

          <hr style="margin-top: 30px;"/>

          <small style="color: #999;">This email was sent to ${receiverEmail}. If you did not request a password reset, no further action is required.</small>
        </div>
      `;

      const mailObject = {
        subject: `${process.env.APP_NAME} - Password Reset OTP Request`,
        receiverEmail,
        message
      };

      this.sendEmail(mailObject);

  }

}

export default new MailService();