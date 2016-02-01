'use strict';

let song = require('../../src/server/song.js'),
    expect = require('chai').expect;

var mockRes = {
 status: (code) => {
  return { json: (data) => { } }
 }
}

describe('song module', () => {
 it('saveSong should save a song', () => {

  var req = {
   body: {
   }
  }

  song.saveSong(req, mockRes);
 });
});
