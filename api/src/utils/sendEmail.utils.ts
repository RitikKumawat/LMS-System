import * as nodemailer from 'nodemailer';

interface ISendEmail {
  to: string;
  subject: string;
  html: string;
  attachments?: any;
  fromName?: string;
}

const sendMail = async ({
  html,
  subject,
  to,
  attachments,
  fromName,
}: ISendEmail) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${fromName || process.env.EMAIL_USER_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    return true;
  } catch (error) {
    console.log('Email Send Error :', error);
    return false;
  }
};

export default sendMail;
