'use strict';


module.exports = function () {
 var ds = require ('./docstore.js')('.grid'),
     async = require('async'),
     assert = require('assert');

 var Base64 = {
     _Rixits : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/",

  encode: function(number) {
   var rixit;
   var residual = Math.floor(number);
   var result = '';
   while (true) {
    rixit = residual % 64
    result = this._Rixits.charAt(rixit) + result;
    residual = Math.floor(residual / 64);
    if (residual == 0)  break; }

   return result;
  },

  decode: function(rixits) {
   var result = 0;
   rixits = rixits.split('');
   for (var e in rixits) {
    result = (result * 64) + this._Rixits.indexOf(rixits[e]);
   }
   return result;
  }
 };

 function _encodeGrid (grid) {
  function _encodeRow (row) {
   return Base64.encode(parseInt(row.map ((e) => e ? '1' : '0').join(''), 2));
  }

  var binaryRows = [[], [], [], [], [], [], [], []];

  for (var c in grid) {
   var col = grid[c];
   for (var l in col) {
    var cell = col[l];
    binaryRows[l].push(cell.active);
   }
  }

  var encoded = [];
  for (var r in binaryRows) {
   encoded.push(_encodeRow(binaryRows[r]));
  }

  return encoded.join(' ');
 }

 return {
  save: function (req, res) {
   var doc = {
     grid: _encodeGrid(req.body.grid),
     color: req.body.color,
     resolution: req.body.resolution
   };
   ds.save (doc, function (saveErr, doc) {
     assert(!saveErr, saveErr);
     res.status(200).json(doc);
   });
  },

  getAll: function (req, res) {
    function _decode (encoded) {

     return encoded.split(' ').map((row) => {
      var binaryString = Base64.decode(row).toString(2);
      var padding = "0".repeat(Math.max(64 - binaryString.length, 0));
      var binaryArr = (padding + binaryString).split('');

      return binaryArr;
     })
    }

    ds.getAll().then(function (docs) {
     var g = docs.map((doc) => {
      var binaryRows = _decode (doc.grid);
      var cols = [];

      for (var r in binaryRows) {
       var row = binaryRows[r];
       for (var c in row) {
        var cell = { active: row[c] == 1 };
        if (!cols[c]) cols.push([cell])
        else cols[c].push(cell);
       }
      }

      return {
       resolution: doc.resolution,
       color: doc.color,
       columns: cols
      };
     });
     res.status(200).json({ grids: g });
    });
  },

  get: function (req, res) {
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

  _deleteAll: function (req, res) {
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
 }
};
