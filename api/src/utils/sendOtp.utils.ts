import otpTemplate from './EmailTemplate/otpTemplate';
import sendMail from './sendEmail.utils';

export default async (email: string, otp: string) => {
  await sendMail({
    to: email,
    html: otpTemplate(otp),
    subject: 'Your Verification OTP',
  });
};
