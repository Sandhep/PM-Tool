import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


class Utils {

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
        html: `
          <h2>${mailObject.heading}</h2>
          <p>${mailObject.message}</p>
        `,
      };

      const info = await transporter.sendMail(mailOptions);

      return info;

    } catch (error) {

      throw new Error("Email sending failed: " + error.message);

    }
  }
}

export default new Utils();
