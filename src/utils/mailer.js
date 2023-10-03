// Import essential modules
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

const mailer = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAILER_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};

export default mailer;

export const otpSender = async (to, data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  // Render the email template with the OTP
  const templatePath = path.resolve(
    new URL("../views/emailTemplate.ejs", import.meta.url).pathname
  );
  const html = await ejs.renderFile(templatePath, data);

  // Mail options
  const mailOptions = {
    from: process.env.MAILER_USER,
    to,
    subject: "OTP Verification Email",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};
