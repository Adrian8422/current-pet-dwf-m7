// create reusable transporter object using the default SMTP transport
const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
  host: process.env.HOST_NODEMAILER,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "manbassman1996@gmail.com", // generated ethereal user
    pass: process.env.API_KEY_MAILER, // generated ethereal password
  },
});

export async function sendEmailToUser(emailUser, name, message, cellphone) {
  let info = transporter
    .sendMail({
      from: '"Forgot password 👻" <manbassman1996@gmail.com>', // sender address
      to: emailUser, // list of receivers
      subject: `${name} vio tu mascota`, // Subject line
      text: `His cellphone is: ${cellphone}`, // plain text body
      html: `<strong> Your pet was seen in: ${message} </strong>
    and his cellphone ${cellphone} `, // html body
    })
    .catch((error) => {
      console.log("aca esta", error);
    });
}
// send mail with defined transport object

transporter.verify().then(() => {
  console.log("Ready for send emails");
});
