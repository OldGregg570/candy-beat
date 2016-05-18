
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
    midi    = require('midi'),
    port = process.argv[2] || config.port,
    output = new midi.output(),
    usbOut = true;

console.log(output.getPortName(1));

try {
 output.openPort(1);
} catch(e) {
 console.log("Couldn't connect to usb UNO device.");
 usbOut = false;
}

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


app.post('/midi/', (req, res) => {
    output.sendMessage([0x90 + req.body.channel, req.body.note + 60, 70]);
    setTimeout(() => {
        output.sendMessage([0x80 + req.body.channel, req.body.note + 60, 70]);
    }, 100);

    res.status(200).send();
});

logger.info ('Starting Candy Beat server on port ' + port);
app.listen(port);
