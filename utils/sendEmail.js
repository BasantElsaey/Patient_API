const nodemailer = require("nodemailer");

const sendEmail = async (options) =>{
  // create transporter (service that will send email like gmail)
   const transporter = nodemailer.createTransport({
      host : process.env.EMAIL_HOST,
      port : process.env.EMAIL_PORT,  // if port is false --> 587, port is true --> 465
      secure : true,
      auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASSWORD,
      },
   })

  // Define email options (from,to,subject,text)
  const mailOptions = {
    from : `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`,
    to : options.email,
    subject : options.subject,
    text : options.message
  }

  // send email
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;



