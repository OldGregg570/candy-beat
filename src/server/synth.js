
'use strict';

var ds = require ('./docstore.js')('.synth'),
    async = require('async'),
    assert = require('assert');

module.exports = {

  saveSynth: function (req, res) {
    ds.open ('.synth', function (store) {
     store.save (req.body, function (saveErr, doc) {
       assert(!saveErr, saveErr);
       res.status(200).json(doc);
     });
    });
  },

  getSynths: function (req, res) {
    ds.getAll().then(function (docs) {
     res.status(200).json(docs);
    });
  },

  getSynth: function (req, res) {
    ds.get(req.params.id).then(function (doc) {
     res.status(200).json(doc);
    });
  },

  delete: function (req, res) {
   ds.open ('.synth', function (store) {
    store.remove (req.params.id, function (removeErr) {
     assert(!removeErr, removeErr);
      res.status(200).json({});
    });
   });
  },

  _deleteNameless: function (req, res) {
   ds.open ('.synth', function (store) {
    store.scan ((doc) => doc.name === undefined , function (scanErr, docs) {
     async.eachSeries(docs, function (doc, cb) {
       store.remove(doc._id, cb);
     },
     function done () {
      assert(!scanErr, scanErr);
      res.status(200).json({});
     });
    });
   });
  }
};
