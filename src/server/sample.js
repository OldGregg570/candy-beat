
'use strict';

var fs = require ('fs'),
    assert = require('assert'),
    samplesDir = require('../config.js').samplesDir;

module.exports = {

 // GET /samples/
 getSamples: function (request, response) {
  fs.readdir (samplesDir, function (err, files) {
   assert(!err, err);
   response.status(200).json(files);
  });
 },

 // POST /sample/
 saveSample: function (request, response) {
  fs.readFile(request.file.path, function(err, data) {
   assert(!err, err);
   fs.writeFile(samplesDir + request.file.originalname, data, function (err) {
    assert(!err, err);
    response.status(200).json({ fname: request.file.originalname });
   });
  });
 }
};
