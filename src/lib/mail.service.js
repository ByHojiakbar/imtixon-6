require("dotenv").config();
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const emailService = async (email, otp) => {
  try {
    const info = await transport.sendMail({
      from: `"AutoVault" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify OTP",
      text: `Your verification code: ${otp}`,
    });
    return info;
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    throw err;
  }
};

module.exports = emailService;