const axios = require('axios');
const Usuario = require("../core/models/Usuario");
const BitacoraVerificacion = require("../core/models/bitacoraVerificacion");
const generateRandomHexString = require("../core/services/cryptoService");

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

    const existingUser = await Usuario.findOne({ correoElectronico });
    if (existingUser) {
      return res.status(400).json({
      success: false,
      message: "El correo electrónico ya está en uso.",
      });
    }

    //const nuevoUsuario = new Usuario(req.body);
    const nuevoUsuario = new Usuario({
      nit,
      correoElectronico,
      password,
      status: 0
    });

    //const nuevoUsuario = new Usuario(req.body.nit, req.body.correoElectronico, req.body.contraseña);
    await nuevoUsuario.save();

    const hexString = generateRandomHexString();

    const bitacoraVerificacion = new BitacoraVerificacion({
      nit: nuevoUsuario.nit,
      evento: 0,
      codigoVerificacion: hexString,
      fechaExpiracion: Date.now() + 12 * 60 * 60 * 1000 // 12 hours,
    });

    await bitacoraVerificacion.save();

    res.status(201).send("Usuario registrado exitosamente.");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(400).send(error);
  }
};

exports.verifyUser = async function (req, res) {
  const { codigoVerificacion, nit } = req.body;
  if (!codigoVerificacion) {
    return res
      .status(400)
      .json({ success: false, message: "Código de verificación faltante" });
  }

  try {
    //const usuario = await Usuario.findOne({ codigoVerificacion });
    const usuario = await Usuario.findOne({ nit, codigoVerificacion });
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    usuario.verificado = true;
    await usuario.save();
    res.json({ success: true, message: "Usuario verificado exitosamente" });
  } catch (error) {
    console.error("Error al verificar el usuario:", error);
    res.status(500).send("Error al verificar el usuario.");
  }
};
