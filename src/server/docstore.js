'use strict';
var assert = require('assert'),
    ds = require ('docstore'),
    docstoreOptions = {
        format: {
           serialize: function (obj) {
               return JSON.stringify(obj, null, '\t');
           },
           deserialize: function (buffer) {
            try {
                return JSON.parse(buffer);
            } catch (e) {
                throw new Error(e.name);
            }           }
        }
     };

module.exports = {
    options: docstoreOptions,
    open: function (ext, cb) {
      docstoreOptions.format.extension = ext;
      ds.open (__dirname + '/docstore', docstoreOptions, function (openErr, store) {
       assert(!openErr, openErr);
       cb(store);
      });
    }
};
