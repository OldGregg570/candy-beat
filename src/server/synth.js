
'use strict';

var ds = require ('./docstore.js');


module.exports = {

  saveSynth: function (req, res) {
    ds.open ('.synth', function (store) {
     store.save (req.body, function (saveErr, doc) {
         saveErr ? res.status(500) : res.status(200).json(doc);
     });
    });
  },

  getSynths: function (req, res) {
    ds.open ('.synth', function (store) {
      store.scan (() => true, function (scanErr, docList) {
        scanErr ? console.log (scanErr) : res.status(200).json(docList);
      });
    });
  },

  getSynth: function (req, res) {
    ds.open ('.synth', function (store) {
      store.get (req.params.id, function (getErr, doc) {
        getErr ? console.log (getErr) : res.status(200).json(doc);
      });
    });
  }
};
