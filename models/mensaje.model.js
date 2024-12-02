'use strict'
const mongoose= require('mongoose');
const summaConnection = require('../core/connections/summaConnection');

const mensajeSchema = new mongoose.Schema({
    numero: {type: Number, require},
    idioma: {type: String, require},
    mensaje: {type: String, require},
    tipo: { type: String, require}
},
{ collection: "mensaje"}
);
const Mensaje = summaConnection.model('mensaje',mensajeSchema);
module.exports=Mensaje;