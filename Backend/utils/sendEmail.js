const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // 📌 Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📌 Email options
    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html, // optional
    };

    // 📌 Send email
    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;