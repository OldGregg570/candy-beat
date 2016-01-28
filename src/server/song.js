
'use strict';

var ds = require ('docstore'),
    assert = require('assert');

var docstoreOptions = {
    format: {
        serialize: function (obj) {
            return JSON.stringify(obj, null, '\t');
        },
        deserialize: function (buffer) {
            return JSON.parse(buffer);
        }
    }
};

function dsOpen (extension, cb) {
 docstoreOptions.format.extension = extension;
 ds.open (__dirname + '/docstore', docstoreOptions, function (openErr, store) {
  assert(!openErr, openErr);
  cb(store);
 });
}

module.exports = {
  saveSong: function (req, res) {
    dsOpen ('.candy', function (store) {
     store.save (req.body, function (saveErr, doc) {
         saveErr ? res.status(500) : res.status(200).json(doc);
     });
    });
  },

  getSongs: function (req, res) {
    dsOpen ('.candy', function (store) {
      store.scan (() => true, function (scanErr, docList) {
        scanErr ? console.log (scanErr) : res.status(200).json(docList);
      });
    });
  },

  getSong: function (req, res) {
    dsOpen ('.candy', function (store) {
      store.get (req.params.id, function (getErr, doc) {
        getErr ? console.log (getErr) : res.status(200).json(doc);
      });
    });
  },

  saveSynth: function (req, res) {
    dsOpen ('.synth', function (store) {
     store.save (req.body, function (saveErr, doc) {
         saveErr ? res.status(500) : res.status(200).json(doc);
     });
    });
  },

  getSynths: function (req, res) {
    dsOpen ('.synth', function (store) {
      store.scan (() => true, function (scanErr, docList) {
        scanErr ? console.log (scanErr) : res.status(200).json(docList);
      });
    });
  },

  getSynth: function (req, res) {
    dsOpen ('.synth', function (store) {
      store.get (req.params.id, function (getErr, doc) {
        getErr ? console.log (getErr) : res.status(200).json(doc);
      });
    });
  }
};
