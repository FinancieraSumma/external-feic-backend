'use strict'
var express=require('express');
var api= express.Router();
var feicCatController = require('../../controllers/feic/feic_cat.controller');
//var md_auth           = require('../_middlewares/authenticate');
api.get    ('/feiccat/test',feicCatController.feicCat_test);
api.get    ('/feiccat',     feicCatController.feicCat_list);
api.post   ('/feiccat',     feicCatController.feicCat_add); 
api.get    ('/feiccat/:id', feicCatController.feicCat_one);  
api.put    ('/feiccat/:id', feicCatController.feicCat_update);  
api.delete ('/feiccat/:id', feicCatController.feicCat_delete);
//http://localhost:3000/bkd/feiccat/test

module.exports = api;