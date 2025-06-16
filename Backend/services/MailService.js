import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import UserRepository from '../repositories/UserRepository.js';

class MailService{

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

      throw new Error("Email sending failed: " + error.message);

    }
  }

  async sendOnboardMail(receiverEmail, name) {

    const subject = `Welcome to ${process.env.APP_NAME} - Your Project Journey Starts Here 🚀`;

    const message = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2c3e50;">Hello ${name}, welcome to <span style="color: #3498db;">PM Tool</span>!</h2>

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

    const message = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2c3e50;">You've been invited to join a project on <span style="color: #3498db;">${process.env.APP_NAME}</span>!</h2>

        <p>Hello,</p>

        <p><strong>${invitingUser.name || "A team member"}</strong> has invited you to collaborate on a project as a <strong>${dataObject.role}</strong>.</p>

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

}

export default new MailService();