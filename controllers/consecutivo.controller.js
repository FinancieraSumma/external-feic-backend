'use strict'
//models
var Consecutivo = require('../models/consecutivo.model');
var Mensaje     = require('../models/mensaje.model');


// one
async function consecutivo_edit (req,res){
    var mkid =req.params.id;
    Consecutivo.findOneAndUpdate(
        {clave: mkid}, 
        {$inc: { numero: 1}}, 
        { new: true, upsert: true }, function(err, mkconsecutivo)   {
        if (err){
            res.status(500).send({messege:err.messege});
        } else {
            if (!mkconsecutivo){
                res.status(404).send({messge:'no se encontro la clave'});
            } else {
                res.status(200).send(mkconsecutivo)
            }
        }
    });
};




    


module.exports={
    consecutivo_edit
};

