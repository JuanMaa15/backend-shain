import { ALLOWED_FRONTEND_URL, EMAIL_USER, NODE_ENV, RESEND_EMAIL } from "#config/env.config.js";
import { resend, transportNodemailer } from "#config/mail.config.js";

const mailService = {

  sendResetMail: async({email, token}) => {

    const url = `${ALLOWED_FRONTEND_URL}/reset-password?token=${token}`;

    let mail;
    if ( NODE_ENV !== 'development' ) 
      mail = await mailService.sendResend({email, url});
    else
      mail = await mailService.sendNodemailer({email, url});

    console.log(mail);

  },

  sendResend: async({email, url}) => await resend.emails.send({
    from: RESEND_EMAIL,
    to: email,
    subject: 'Recuperación de contraseña',
    html:`
      <h2>Restablece tu contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecerla:</p>
      <a href="${url}">${url}</a>
      <p>Este enlace expirará en 15 minutos.</p>
      `
  }), 

  sendNodemailer: async({email, url}) => await transportNodemailer.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    html:`
      <h2>Restablece tu contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecerla:</p>
      <a href="${url}">${url}</a>
      <p>Este enlace expirará en 15 minutos.</p>
      `
  }),

}

export default mailService;