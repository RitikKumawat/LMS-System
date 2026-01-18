import * as nodemailer from 'nodemailer';

interface ISendEmail {
  to: string;
  subject: string;
  html: string;
  attachments?: any;
}

const sendMail = async ({ html, subject, to, attachments }: ISendEmail) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // MUST be smtp.gmail.com
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false, // ✅ IMPORTANT
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
      attachments,
    });
    return true;
  } catch (error) {
    console.error('Email Send Error:', error);
    return false;
  }
};

export default sendMail;
