// Modelos
var Cat_feic = require("../../models/feic/cat_feic.model");
var feicCatalogos = require("../../modules/feic/feicCat.module");
var Mensaje = require("../../models/mensaje.model");
//npm
//var moment = require('moment');

async function feicCat_test(req, res) {
  res.status(200).send({
    message: "Probando modulo de FEIC catalogos",
    user: req.user,
  });
}

async function feicCat_add(req, res) {
  var cat_feic = new Cat_feic();
  var params = req.body;
  var mkIdioma = "es";
  // datos
  cat_feic.grupo = params.grupo;
  cat_feic.codigo = params.codigo;
  cat_feic.raiz = params.raiz;
  cat_feic.descripcion = params.descripcion;

  cat_feic.save((err, savedoc) => {
    if (err) {
      Mensaje.find({ numero: 4013, idioma: mkIdioma }, (err, msjdesc) => {
        var objmsj = msjdesc[0];
        res.status(500).send(objmsj);
      });
    } else {
      if (!savedoc) {
        Mensaje.find({ numero: 4013, idioma: mkIdioma }, (err, msjdesc) => {
          var objmsj = msjdesc[0];
          res.status(500).send(objmsj);
        });
      } else {
        Mensaje.find({ numero: 0, idioma: mkIdioma }, (err, msjdesc) => {
          var objmsj = msjdesc[0].toObject();
          objmsj.ref = params.clave;
          res.status(200).send(objmsj);
        });
      }
    }
  });
}

async function feicCat_list(req, res) {
  const mkIdioma = "es";
  try {
    const catalogo = req.query.catalogo.trim();

    if (!catalogo) {
      return res.status(400).send({ message: "Missing catalogo parameter" });
    }

    // Use 'await' to handle the returned Promise
    const documents = await Cat_feic.find({ grupo: catalogo });

    if (!documents || documents.length === 0) {
      // Use 'await' with Mensaje.find()
      const msjdesc = await Mensaje.find({ numero: 4019, idioma: mkIdioma });
      if (msjdesc && msjdesc.length > 0) {
        const objmsj = msjdesc[0];
        res.status(404).send(objmsj);
      } else {
        // Handle the case where no message is found
        res.status(404).send({ message: "No messages found" });
      }
    } else {
      res.status(200).send(documents);
    }
  } catch (error) {
    console.error("Error in feicCat_list:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function feicCat_one(req, res) {
  var mkid = req.params.id;
  var mkIdioma = "es";
  Cat_feic.findById(mkid, (err, document) => {
    if (err) {
      Mensaje.find({ numero: 4013, idioma: mkIdioma }, (err, msjdesc) => {
        var objmsj = msjdesc[0];
        res.status(500).send(objmsj);
      });
    } else {
      if (!document) {
        Mensaje.find({ numero: 4019, idioma: mkIdioma }, (err, msjdesc) => {
          var objmsj = msjdesc[0];
          res.status(500).send(objmsj);
        });
      } else {
        res.status(200).send(document);
      }
    }
  });
}

async function feicCat_update(req, res) {
  var mkid = req.params.id;
  var params = req.body;
  var mkidioma = "es";
  Cat_feic.findByIdAndUpdate(
    mkid,
    {
      grupo: params.grupo,
      codigo: params.codigo,
      raiz: params.raiz,
      descripcion: params.descripcion,
    },
    { upsert: true, new: true },
    function (err, document) {
      if (err) {
        Mensaje.find({ numero: 4013, idioma: mkidioma }, (err, msjdesc) => {
          var objmsj = msjdesc[0];
          res.status(500).send(objmsj);
        });
      } else {
        if (!document) {
          Mensaje.find({ numero: 4013, idioma: mkidioma }, (err, msjdesc) => {
            var objmsj = msjdesc[0];
            res.status(500).send(objmsj);
          });
        } else {
          Mensaje.find({ numero: 0, idioma: mkidioma }, (err, msjdesc) => {
            var objmsj = msjdesc[0].toObject();
            objmsj.ref = params.clave;
            res.status(200).send(objmsj);
          });
        }
      }
    }
  );
}

async function feicCat_delete(req, res) {
  var mkid = req.params.id;
  var mkIdioma = "es";
  Cat_feic.findByIdAndDelete(mkid, function (err, document) {
    if (err) {
      Mensaje.find({ numero: 4013, idioma: mkIdioma }, (err, msjdesc) => {
        var objmsj = msjdesc[0];
        res.status(500).send(objmsj);
      });
    } else {
      if (!document) {
        Mensaje.find({ numero: 4013, idioma: mkIdioma }, (err, msjdesc) => {
          var objmsj = msjdesc[0];
          res.status(500).send(objmsj);
        });
      } else {
        Mensaje.find({ numero: 0, idioma: mkIdioma }, (err, msjdesc) => {
          var objmsj = msjdesc[0].toObject();
          objmsj.ref = req.params.id;
          res.status(200).send(objmsj);
        });
      }
    }
  });
}

module.exports = {
  feicCat_test,
  feicCat_add,
  feicCat_list,
  feicCat_one,
  feicCat_update,
  feicCat_delete,
};
