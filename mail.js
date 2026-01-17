// const nodeMailer = require('nodemailer');
// require('dotenv').config();


// const transporter = nodeMailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

 
// const sendMail=async (to,otp) => {
//     console.log("Sending email to:", to);
//     console.log("OTP:", otp);
//     const now = new Date();

// const year = now.getFullYear();
// const month = now.getMonth() + 1; // months start from 0
// const day = now.getDate();
//     let value=otp+year+month+day;
//     console.log("hi",value);
//     try{
//   const info = await transporter.sendMail({
//     from:"tonay@chat.in" ,
//     to: to, // List of receivers",
//     subject: "OTP for Email Verification", // Subject line
//     text: "", // Plain-text version of the message
//     html: "<b>Your OTP is: " + value + "</b>", // HTML version of the message
//   });


//   console.log("Message sent:", info.messageId);
//   }catch(err){
//   console.log(err);
// }
// };

// module.exports = { transporter, sendMail };

require('dotenv').config();
const { Resend } = require("resend");

console.log("Resend API Key:", process.env.RESEND_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (userEmail, otp) => {
 try{
  let value = otp + 1001;
  console.log("hi", value);
  const html = `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AddaChat OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:20px;">
    <tr>
      <td align="center">

        <table width="100%" max-width="500" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:8px; padding:25px; box-shadow:0 5px 15px rgba(0,0,0,0.1);">

          <!-- Logo / Title -->
          <tr>
            <td align="center" style="padding-bottom:15px;">
              <h2 style="color:#4f46e5; margin:0;">AddaChat</h2>
              <p style="color:#666; font-size:14px; margin:5px 0 0;">
                Email Verification
              </p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="color:#333; font-size:15px; line-height:1.6;">
              Hello 👋,<br><br>
              Use the following One-Time Password (OTP) to verify your email
              address on <strong>AddaChat</strong>.
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:20px 0;">
              <div style="
                display:inline-block;
                background:#f0f1ff;
                color:#4f46e5;
                font-size:28px;
                letter-spacing:6px;
                font-weight:bold;
                padding:12px 24px;
                border-radius:6px;
              ">
                ${value}
              </div>
            </td>
          </tr>

          <!-- Info -->
          <tr>
            <td style="color:#555; font-size:14px;">
              <br>
              Please do not share this code with anyone.
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:20px; color:#888; font-size:12px; text-align:center;">
              If you did not request this, you can safely ignore this email.
              <br><br>
              © 2026 AddaChat. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>

  `;

  let x = await resend.emails.send({
    from: "adda-chat@mind-spark.solutions",
    to: userEmail,
    subject: "OTP Verification",
    html,
  });
  console.log("Email sent:", x);
 }catch(err){
 console.log(err);
 }
};

module.exports = { sendMail };




