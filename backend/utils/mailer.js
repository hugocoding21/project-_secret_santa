require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Send email
const sendInvitationEmail = async (recipientEmail, groupName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `You're invited to join the Secret Santa Group: ${groupName}`,
      text: `Hi! You've been invited to join the Secret Santa group: ${groupName}. Follow the link to join: [Link to join]`,
      html: `<p>Hi!</p><p>You've been invited to join the Secret Santa group: <strong>${groupName}</strong>.</p><p><a href="http://${process.env.HOST}:${process.env.PORT_FRONT}/">Click here to join</a></p>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendInvitationEmail;
