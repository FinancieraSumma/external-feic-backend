'use strict'

const mongoose= require('mongoose');
const summaConnection = require('../../core/connections/summaConnection');

const cat_feicSchema = new mongoose.Schema({
	grupo:{type: String,	required: true},
	codigo: {type: String,	required: true},
	raiz:{type: String,	required: true},
	descripcion:{type: String,	required: true},

},
{ collection: "cat_feic"}
);
const Cat_feic = summaConnection.model('cat_feic',cat_feicSchema);
module.exports=Cat_feic;
