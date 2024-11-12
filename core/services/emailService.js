const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lagv.ales@gmail.com",
    pass: "fonu vuwy brms vbtu",
  },
});

function sendVerificationEmail(email, codigoVerificacionCombinado) {
  const mailOptions = {
    from: "lagv.ales@gmail.com",
    to: email,
    subject: "Verifica tu Cuenta - Código de Verificación",
    text: `Hola,

Gracias por registrarte en nuestra plataforma. Para completar tu registro, necesitamos que verifiques tu cuenta.

A continuación, encontrarás tu código de verificación. Por favor, cópialo y pégalo en la página de verificación:

Código de Verificación: ${codigoVerificacionCombinado}

Para verificar tu cuenta, visita el siguiente enlace:
http://localhost:4200/verify

Este código de verificación es válido por 24 horas. Si no completas la verificación en este tiempo, deberás contactar al equipo de soporte para solventar el problema.

Si no solicitaste esta cuenta, por favor ignora este mensaje.

Gracias,
El Equipo de Soporte.
`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
    }
  });
}

module.exports = sendVerificationEmail;
