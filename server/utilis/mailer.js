const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const sendWelcomeEmail = async (email, name,password) => {
  await transporter.sendMail({
    from: `"SikilShareSocial" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to SikilShareSocial 🚀",
    html: `
      <h2>Hello ${name} 👋</h2>
      <p>Your account on <b>SikilShareSocial</b> has been created successfully.</p>
      <p>your password is :{${password}}</p>
      <p>Start sharing your skills with the community.</p>
      <br/>
      <b>Team SikilShareSocial</b>
      
    `,
  });
};
const sendWelcomeAlumniEmail=async(email,password)=>{
    await transporter.sendMail({
    from: `"IUST Alumni Connect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to IUST  🚀",
    html: `
      <h2>Hello Dear,👋</h2>
      <p>Your account on <b>IUST Alumni Account </b> has been created successfully.</p>
      <p>your password is :{${password}}</p>
      <p>Start sharing your skills with the community.</p>
      <br/>
      <b>Team SikilShareSocial</b>
      
    `,
  });
}

module.exports = { sendWelcomeEmail,sendWelcomeAlumniEmail };
