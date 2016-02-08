'use strict';

let expect = require('chai').expect,
    sample = require('../../src/server/sample.js'),
    Response = require('./test-utils.js').response;

describe('sample module', () => {
  var sampleCount = 0;

  before ((done) => {
   sample.deleteSample ({ filename: 'test.wav' }, Response ((body) => { done(); }));
  });

  it('getting sample list should return more than eight samples', (done) => {
   var res = Response  ((body) => {
    expect(body.length).to.be.above(8);
    sampleCount = body.length;
    done();
   });

   sample.getSamples({}, res);
  });

  it('saving sample should increase the list length by one', (done) => {
   var saveReq = { file: { path: './test/tmp/test.wav', originalname: 'test.wav' }};

   sample.saveSample(saveReq, Response ((body) => {
    sample.getSamples({}, Response ((body) => {
     expect(body.length).to.equal(sampleCount + 1);
     done();
    }));
   }));
  });

  it('deleting nonexistent sample should log an error', (done) => {
   sample.deleteSample ({ filename: 'nonexist.wav' }, Response ((body) => {
    expect(body.err.code).to.equal('ENOENT');
    done();
   }));
  });

  it('deleting a sample should reduce the list length by one', (done) => {
   sample.deleteSample ({ filename: 'test.wav' }, Response ((body) => {
    sample.getSamples({}, Response ((body) => {
     expect(body.length).to.equal(sampleCount);
     done();
    }));
   }));
  });
});
