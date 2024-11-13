const axios = require("axios");
const Usuario = require("../core/models/Usuario");
const BitacoraVerificacion = require("../core/models/bitacoraVerificacion");
const generateRandomHexString = require("../core/services/cryptoService");
const {
  sendVerificationEmail,
  sendLoginVerificationEmail,
  sendPasswordResetEmail,
} = require("../core/services/emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const RECAPTCHA_SECRET_KEY =
  process.env.RECAPTCHA_SECRET_KEY ||
  "6LeL9nAqAAAAAD58zuUWRSEBoWyXGBgKlSoBpkUv"; // Replace this with your reCAPTCHA v3 secret key

exports.registerUser = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is missing" });
  }
  const { nit, correoElectronico, password } = req.body;
  // console.log(`nit: ${nit}, correoElectronico: ${correoElectronico}, contraseña: ${password}}, token: ${token.substring(0, 10)}`);

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );
    // console.log("reCaptcha Verification response:", response.data);

    const { success, score } = response.data;
    if (!success || score < 0.5) {
      return res.status(400).json({
        success: false,
        message: "Verification failed, score too low",
      });
    }
    console.log("reCaptcha Verification successful");

    const correoElectronicoYaRegistrado = await Usuario.findOne({
      correoElectronico,
    });
    if (correoElectronicoYaRegistrado) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya está en uso.",
      });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = new Usuario({
      nit,
      correoElectronico,
      password: hashedPassword,
      status: 0,
    });

    //const nuevoUsuario = new Usuario(req.body.nit, req.body.correoElectronico, req.body.contraseña);
    await nuevoUsuario.save();

    const codigoVerificacion = generateRandomHexString();
    const secret = process.env.JWT_SECRET || "my_fallback_secret_key"; // Replace 'your_fallback_secret_key' with a secure fallback secret key
    const combinedToken = jwt.sign({ nit, codigoVerificacion }, secret, {
      expiresIn: "1d",
    });

    const bitacoraVerificacion = new BitacoraVerificacion({
      nit: nuevoUsuario.nit,
      evento: 0,
      codigoVerificacion,
      fechaExpiracion: Date.now() + 24 * 60 * 60 * 1000, // 12 hours,
    });

    await bitacoraVerificacion.save();

    // Send email with verification code
    sendVerificationEmail(nuevoUsuario.correoElectronico, combinedToken);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente.",
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(400).send(error);
  }
};

exports.verifyUser = async function (req, res) {
  console.log("Verificando usuario...");
  console.log(req.body);
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Código de verificación faltante" });
  }

  try {
    const secret = process.env.JWT_SECRET || "my_fallback_secret_key"; // Replace 'your_fallback_secret_key' with a secure fallback secret key
    const { nit, codigoVerificacion } = jwt.verify(token, secret);

    const bitacoraVerificacion = await BitacoraVerificacion.findOne({
      nit,
      codigoVerificacion,
      evento: 0,
    }).sort({ fechaExpiracion: -1 });
    if (!bitacoraVerificacion) {
      return res.status(404).json({
        success: false,
        message: "Bitácora de verificación no encontrada",
      });
    }

    const usuario = await Usuario.findOne({ nit });
    usuario.status = 1;
    await usuario.save();
    res.json({ success: true, message: "Usuario verificado exitosamente" });
  } catch (error) {
    console.error("Error al verificar el usuario:", error);
    res.status(500).send("Error al verificar el usuario.");
  }
};

exports.login = async function (req, res) {
  const { nit, password } = req.body;
  console.log(`nit: ${nit}, contraseña: ${password}`);

  try {
    // Usuario.findOne({ nit, password }, async function (err, usuario) {
    //   if (err) {
    //     console.error("Error al iniciar sesión:", err);
    //     return res.status(500).send("Error al iniciar sesión.");
    //   }

    const usuario = await Usuario.findOne({ nit });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "NIT no encontrado.",
      });
    }

    if (usuario.status !== 1) {
      return res.status(403).json({
        success: false,
        message: "Usuario no verificado.",
      });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).send("Contraseña incorrecta.");
    }

    const codigoVerificacion = generateRandomHexString();
    const secret = process.env.JWT_SECRET || "my_fallback_secret_key";
    const combinedToken = jwt.sign({ nit, codigoVerificacion }, secret, {
      expiresIn: "1d",
    });

    const bitacoraVerificacion = new BitacoraVerificacion({
      nit: usuario.nit,
      evento: 1,
      codigoVerificacion,
      fechaExpiracion: Date.now() + 1 * 60 * 60 * 1000, // 1 hour
    });

    await bitacoraVerificacion.save();

    // Send email with verification code
    sendLoginVerificationEmail(usuario.correoElectronico, combinedToken);

    res.json({
      success: true,
      message: "Inicio de sesión exitoso y código de verificación enviado.",
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(400).send(error);
  }
};

exports.verifyLogin = async function (req, res) {
  console.log("Verificando login del usuario...");
  console.log(req.body);
  const { token } = req.body;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Código de verificación faltante" });
  }

  try {
    const secret = process.env.JWT_SECRET || "my_fallback_secret_key"; // Replace 'your_fallback_secret_key' with a secure fallback secret key
    const { nit, codigoVerificacion } = jwt.verify(token, secret);

    const bitacoraVerificacion = await BitacoraVerificacion.findOne({
      nit,
      codigoVerificacion,
      evento: 1,
    }).sort({ fechaExpiracion: -1 });
    if (!bitacoraVerificacion) {
      return res.status(404).json({
        success: false,
        message: "Bitácora de verificación no encontrada",
      });
    }

    const usuario = await Usuario.findOne({ nit });
    usuario.status = 1;
    await usuario.save();
    res.json({
      success: true,
      message: "Login de usuario verificado exitosamente",
    });
  } catch (error) {
    console.error("Error al verificar el login del usuario:", error);
    res.status(500).send("Error al verificar el login del usuario.");
  }
};

exports.forgotPassword = async function (req, res) {
  try {
    const { nit } = req.body;

    // Find the user by nit
    const usuario = await Usuario.findOne({ nit });

    if (!usuario) {
      return res.status(400).send("Usuario no encontrado.");
    }

    const secret = process.env.JWT_SECRET || "my_fallback_secret_key";
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

    // Generate a reset token with a short expiration (e.g., 1 hour)
    const resetToken = jwt.sign({ nit }, secret, {
      expiresIn: "1h",
    });

    // Hash the reset token and save to the user record
    const hashedResetToken = await bcrypt.hash(resetToken, saltRounds);
    usuario.passwordResetToken = hashedResetToken;
    usuario.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await usuario.save();

    // Send reset email with token link
    const resetUrl = `http://localhost:4200/resetPassword?token=${resetToken}&nit=${nit}`;
    sendPasswordResetEmail(usuario.correoElectronico, resetUrl);

    res
      .status(200)
      .send("Se ha enviado un enlace de restablecimiento de contraseña.");
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);
    res.status(500).send("Error al solicitar restablecimiento de contraseña.");
  }
};

exports.resetPassword = async function (req, res) {
  try {
    const { nit, token, password } = req.body;

    // Verify the token
    const secret = process.env.JWT_SECRET || "my_fallback_secret_key";
    const decoded = jwt.verify(token, secret);
    if (decoded.nit !== nit) {
      return res.status(400).send('Token de restablecimiento inválido.');
    }

    // Find the user by nit
    const usuario = await Usuario.findOne({ nit });

    if (!usuario) {
      return res.status(400).send('Usuario no encontrado.');
    }

    // Verify if the token matches and is still valid
    const isTokenValid = await bcrypt.compare(token, usuario.passwordResetToken);
    if (!isTokenValid || Date.now() > usuario.passwordResetExpires) {
      return res.status(400).send('Token de restablecimiento inválido o expirado.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    usuario.password = hashedPassword;

    // Clear the reset token and expiration
    usuario.passwordResetToken = null;
    usuario.passwordResetExpires = null;

    await usuario.save();

    res.status(200).send('Contraseña restablecida exitosamente.');
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).send('Error al restablecer la contraseña.');
  }
};
