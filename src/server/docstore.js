'use strict';
var assert = require('assert'),
    ds = require ('docstore');

var docstoreOptions = {
    format: {
       serialize: function (obj) {
           return JSON.stringify(obj, null, '\t');
       },
       deserialize: function (buffer) {
        try {
            return JSON.parse(buffer);
        } catch (e) {
            throw new Error(e.name);
        }
      }
    }
 };

module.exports = function (ext) {
 var docstore = {};

 function _open (extension, cb) {
  docstoreOptions.format.extension = extension;
  ds.open (__dirname + '/docstore', docstoreOptions, function (openErr, store) {
   assert(!openErr, openErr);
   cb(store);
  });
 }

 _open (ext, function (store) {
  docstore.store = store;
 });

 docstore.options = docstoreOptions;
 docstore.open = _open;


 docstore.get = function (id) {
   return new Promise(function (resolve) {
    docstore.store.get(id, function (getErr, doc) {
     assert(!getErr, getErr);
     resolve(doc);
   });
  });
 }

 docstore.getAll = function () {
  return new Promise(function (resolve) {
   docstore.store.scan(() => true, function (scanErr, docList) {
    assert(!scanErr, scanErr);
    resolve(docList);
   });
  });
 }

 return docstore;
};
