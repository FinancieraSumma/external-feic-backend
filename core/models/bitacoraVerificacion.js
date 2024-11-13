const mongoose = require('mongoose');
const generateRandomHexString = require("../services/cryptoService");

const esquemaBitacoraVerificacion = new mongoose.Schema({
  nit: {
    type: String,
    required: true,
  },
  evento: {
    type: Number,
    required: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  },
  codigoVerificacion: {
    type: String,
    required: true,
    default: function() {
      return generateRandomHexString();
    }
  },
  fechaExpiracion: {
    type: Date,
    required: true
  },
}, {
  collection: 'bitacoraVerificaciones'
});

esquemaBitacoraVerificacion.index({ nit: 1, codigoVerificacion: 1 }, { unique: true });
const BitacoraVerificacion = mongoose.model('BitacoraVerificacion', esquemaBitacoraVerificacion);

module.exports = BitacoraVerificacion;
