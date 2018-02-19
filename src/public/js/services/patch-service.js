angular.module('CandyBeatApp').factory('patchService', function ($window, music, randomService, $q) {
   var randIntLinear   = randomService.randIntLinear;
   var randInt         = randomService.randInt;
   var randFloatLinear = randomService.randFloatLinear;
   var select          = randomService.select;

   var ctx = new AudioContext();

   function _generateRandomSynth (cb, res) {
    if (!res) res = 1;

    _randomOscs(function (oscs) {
     cb ([{
      gain: 80,
      type: 'synth',
      lfo: {
       level:       randInt(0, 2) === 0 ? 0 : randIntLinear(0, 40),
       frequency:   randFloatLinear(0, 10),
       destination: select(['filter.cutoff', 'osc-2.frequency'])
      },
      filter: {
       cutoff: randIntLinear(100, 20000),
       type: 'lowpass'
      },
      envelope: {
       attack: [randInt(1, 10), randInt(20, 80)][randInt(0, res > 2 ? 1 : 0)],
       release: randInt(100, 500),
       sustain: res * randInt(5, 10)
      },
      oscs: oscs,
     }]);
    });
   }

   function _randomOscs (cb) {
    var oscs = [
     {
      octave: randInt(4, 5),
      type: select(music.oscTypes),
      harmony: 0,
      detune: randInt(-2, 2),
      volume: randInt(50, 60)
     },
     {
      octave: randInt(5, 6),
      type: select(music.oscTypes),
      harmony: 0,
      detune: randInt(-8, 8),
      volume: randInt(10, 30)
     },
     {
      octave: randInt(6, 8),
      type: select(music.oscTypes),
      harmony: randInt(-11, 11),
      detune: randInt(-60, 60),
      volume: randInt(1, 10)
     }];

    cb(oscs);
   }

  return {
   generateRandomSynth: _generateRandomSynth,
   randomOscs: _randomOscs
  }
});
