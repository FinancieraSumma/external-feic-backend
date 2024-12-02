'use strict'
const mongoose= require('mongoose');
const consecutivoSchema = new mongoose.Schema({
	clave: {type: String,	required: true, unique: true},
	numero:	{type: Number,	required: true},
	prefijo: {type: String, required: true},
	sufijo:{type: String,	required: true},
    soloNumero:	{type: Boolean,	required: true},
    usarSucursal:	{type: Boolean,	required: true}
},
{ collection: "consecutivo"}
);
const Consecutivo = mongoose.model('consecutivo',consecutivoSchema);
module.exports=Consecutivo;
