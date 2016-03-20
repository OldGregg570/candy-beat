
'use strict';

var express = require('express'),
    path    = require('path'),
    logger  = require('winston'),
    grid    = require('./server/grid.js')(),
    synth   = require('./server/synth.js'),
    parser  = require('body-parser'),
    fs      = require('fs'),
    multer  = require('multer'),
    assert  = require('assert'),
    sample  = require('./server/sample.js'),
    app     = express(),
    config  = require('./config.js'),
    port = process.argv[2] || config.port;

app.use(parser.json());

var up = multer({dest: '/uploads'}).single('file');
//app.use(upload);

app.use (function (req, res, next) {
    logger.debug (req.method + ': ' + req.url);
    next ();
});

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/../bower_components'));
app.use(express.static(__dirname + '/uploads/'));

var res_sendfile = function(file_path) {
    return function (req, res) {
        res.sendFile(path.resolve(__dirname + file_path));
    }
};

app.get('/home',  res_sendfile('/public/index.html'));

app.post('/synths/',       synth.saveSynth);
app.get('/synths/',        synth.getSynths);
app.get('/synths/:id?/',   synth.getSynth);

app.post('/grid/',         grid.save);
app.get('/grid/',          grid.getAll);
app.get('/grid/:id?/',     grid.get);

app.get('/samples/',       sample.getSamples);
app.post('/sample/', up,   sample.saveSample);

logger.info ('Starting Candy Beat server on port ' + port);
app.listen(port);
