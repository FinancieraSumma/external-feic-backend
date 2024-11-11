const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.sendVerificationEmail = (email, codigoVerificacion) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Código de Verificación',
    text: `Hola, gracias por registrarte. Tu código de verificación es: ${codigoVerificacion}. Visita http://localhost:4200/verify para completar tu registro.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
};