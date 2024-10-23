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
      subject: `Invitation à rejoindre le groupe Secret Santa : ${groupName}`,
      text: `Bonjour,

Vous avez été invité à rejoindre le groupe Secret Santa : ${groupName}.

Cliquez sur le lien ci-dessous pour rejoindre :
http://${process.env.HOST}:${process.env.PORT_FRONT}/

Nous avons hâte de vous accueillir !`,
      html: `
        <p>Bonjour,</p>
        <p>Vous avez été invité à rejoindre le groupe Secret Santa : <strong>${groupName}</strong>.</p>
        <p><a href="http://${process.env.HOST}:${process.env.PORT_FRONT}/">Cliquez ici pour rejoindre</a></p>
        <p>Nous avons hâte de vous accueillir !</p>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const sendSantaAttributionEmail = async (recipientEmail, groupName, santa) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Votre Secret Santa a été assigné`,
      text: `Bonjour,

Nous vous informons que votre Secret Santa dans le groupe ${groupName} vient de vous être assigné. 
Vous avez tiré au sort : 
- ${santa}

Bonne chance pour trouver le cadeau parfait !`,
      html: `
        <p>Bonjour,</p>
        <p>Nous vous informons que votre Secret Santa dans le groupe <strong>${groupName}</strong> vient de vous être assigné.</p>
        <p>Vous avez tiré au sort : <strong>${santa}</strong></p>
        <p>Bonne chance pour trouver le cadeau parfait !</p>`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Attribution de Secret Santa envoyée à ${recipientEmail} avec succès.`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi à ${recipientEmail}:`, error);
  }
};

module.exports = { sendInvitationEmail, sendSantaAttributionEmail };
