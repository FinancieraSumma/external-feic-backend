'use strict'
var express=require('express');
var api=express.Router();
//Controlador
var consecutivoCtlr=require('../controllers/consecutivo.controller');

// Rutas    
api.put   ('/consecutivo/:id',consecutivoCtlr.consecutivo_edit);

module.exports = api;