import * as sgMail from "@sendgrid/mail";

export async function sendEmailToUser(
  emailUser,
  name,
  newLocation,
  numberCellphoneUser
) {
  await sgMail.setApiKey(process.env.API_KEY_SENDGRID);
  const msg = {
    to: emailUser,
    from: "manbassman1996@gmail.com",
    subject: `${name} vio a tu mascota`,
    text: `su numero de celular es: ${numberCellphoneUser}`,
    html: `<strong> Tu mascota fue vista en ${newLocation}</strong>
    y su celular es ${numberCellphoneUser}`,
  };
  const enviarMail = await sgMail
    .send(msg)
    .then(() => {
      console.log("email enviado");
    })
    .catch((err) => {
      console.error(err);
    });
  return { email: true, enviarMail };
}
