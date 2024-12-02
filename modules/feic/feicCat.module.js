'use strict'
var Cat_feic=require('../../models/feic/cat_feic.model');


var feicCatalogos = {
    grupo: async function (icatalogo) { 
        try { 
            var documents = await Cat_feic.find({grupo:icatalogo}).sort({descripcion:1})
            return documents; 
        } catch (err) {
            console.log(err);
            } 
    }    
};

module.exports =  feicCatalogos 