const nodeMailer = require('nodemailer');
require('dotenv').config();


const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

 
const sendMail=async (to,otp) => {
    console.log("Sending email to:", to);
    console.log("OTP:", otp);
    const now = new Date();

const year = now.getFullYear();
const month = now.getMonth() + 1; // months start from 0
const day = now.getDate();
    let value=otp+year+month+day;
    console.log("hi",value);
    try{
  const info = await transporter.sendMail({
    from:"tonay@chat.in" ,
    to: to, // List of receivers",
    subject: "OTP for Email Verification", // Subject line
    text: "", // Plain-text version of the message
    html: "<b>Your OTP is: " + value + "</b>", // HTML version of the message
  });


  console.log("Message sent:", info.messageId);
  }catch(err){
  console.log(err);
}
};

module.exports = { transporter, sendMail };
