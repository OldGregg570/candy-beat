'use strict';

let expect = require('chai').expect,
    Synth = require('../../src/server/synth.js'),
    Response = require('./test-utils.js').response;

var sampleSynth = {
    	gain: 80,
    	type: 'synth',
    	lfo: {
    		level:       30,
    		frequency:   4,
    		destination: 'filter.cutoff'
    	},
    	filter: {
    		cutoff: 4000,
    		type: 'lowpass'
    	},
    	envelope: {
    		attack: 10,
    		release: 200,
    		sustain: 400
    	},
    	oscs: [{
    		octave: 4,
    		type: 'sine',
    		harmony: 0,
    		detune: 0,
    		volume: 50
        },
        {
    		octave: 5,
    		type: 'square',
    		harmony: 0,
    		detune: 8,
    		volume: 20
        },
        {
    		octave: 6,
    		type: 'triangle',
    		harmony: 10,
    		detune: -10,
    		volume: 12
    	}]
    }

var swankyInvaders = {
	"gain": 220,
	"type": "synth",
	"lfo": {
		"level": 57,
		"frequency": 9.935954365646467,
		"destination": "filter.cutoff"
	},
	"filter": {
		"cutoff": 8547,
		"type": "lowpass"
	},
	"envelope": {
		"attack": 3,
		"release": 347,
		"sustain": 9
	},
	"oscs": [
		{
			"octave": 5,
			"type": "triangle",
			"harmony": 0,
			"detune": -2,
			"volume": 60
		},
		{
			"octave": 6,
			"type": "triangle",
			"harmony": 0,
			"detune": -4,
			"volume": 15
		},
		{
			"octave": 6,
			"type": "square",
			"harmony": -1,
			"detune": -36,
			"volume": 8
		}
	],
	"name": "Swanky Invaders",
	"_id": "798536062473431230"
}

describe('synth module', () => {
 var synthCount = 0;

 beforeEach (function (done) {
  Synth._deleteNameless ({}, Response((body) => { done(); }));
 });

 it('getting synth list should at least return the default synthesizers', (done) => {
  Synth.getSynths ( {}, Response((body) => {
   synthCount = body.length;
   expect(body.length).to.be.above(6);
   done();
  }));
 });

 it('saving a synth should make the list length increase by one', (done) => {
  Synth.saveSynth({ body: sampleSynth }, Response((body) => {
   Synth.getSynths ( {}, Response((body) => {
    expect(body.length).to.equal(synthCount + 1);
    done();
   }));
  }));
 });

 it('getting synth by ID should have the correct name', (done) => {
   Synth.getSynth ( { params: { id: swankyInvaders._id }}, Response((body) => {
    expect(JSON.stringify(body)).to.equal(JSON.stringify(swankyInvaders));
    done();
   }));
 });

 it('deleting a tutorial should reduce the list length', (done) => {
  Synth.saveSynth({ body: sampleSynth }, Response((doc) => {
   Synth.getSynths ({}, Response((body) => {
    expect(body.length).to.equal(synthCount + 1);
    Synth.delete({ params: { id: doc._id }}, Response((body) => {
     Synth.getSynths ({}, Response((body) => {
      expect(body.length).to.equal(synthCount);
      done();
     }));
    }));
   }));
  }));
 });
});
