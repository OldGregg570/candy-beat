angular.module('CandyBeatApp').factory('patchService', function ($http, $window, music, randomService, $q) {
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


   function _getDecodePromise (fname) {
    var d = $q.defer();
    var options = { responseType: 'arraybuffer' };
    $http.get(fname, options).then(function (res) {
     ctx.decodeAudioData(res.data, d.resolve);
    });
    return d.promise;
   }


   function generateSamplerSet (files, cb) {
    var decodePromises = files.map(_getDecodePromise);

     function newSampler (sample) {
      return {
          gain: 80,
          type: 'sampler',
          lfo: {
           level: 0,
           frequency: 1,
           destination: 'osc-2.frequency'
          },
          filter: {
           cutoff: 0,
           type: 'highpass'
          },
          envelope: {
           attack: 0,
           release: 0,
           sustain: 2000
          },
          oscs: [{
           type: 'sampler',
           sample: sample,
           volume: 100
          }],
         };
     }

    $q.all(decodePromises).then(function (bufferArray) {
     var synths = [];
     for (var i = 0; i < bufferArray.length; i++) {
       synths.push (newSampler ({name: files[i], arrayBuffer: bufferArray[i]}));
     }

     cb(synths);
    });

   }

   function _generateKit808 (cb) {
     generateSamplerSet (['808_bass.wav',
                          '808_sd.wav',
                          '808_hhclosed.wav',
                          '808_hhopen.wav',
                          '808_ltom.wav',
                          '808_htom.wav',
                          '808_rcym.wav',
                          '808_cbell.wav'], cb);
   }

   function _generateRandomSampler (cb) {
    $http.get('/samples/').success(function (samples) {
     randomSamples = [];
     for (var i = 0; i < 8; i++) {
      randomSamples.push(randomService.select(samples));
     }
     generateSamplerSet (randomSamples, cb);
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

   function _randomSample (cb) {
    _getDecodePromise ('808_bass.wav').then(function (bufferArray) {
     cb([{
      type: 'sampler',
      sample: {name: '808_bass.wav', arrayBuffer: bufferArray},
      volume: 100
     }]);
    });


   }

  return {
   generate808: _generateRandomSampler,
   generateRandomSynth: _generateRandomSynth,
   getDecodePromise: _getDecodePromise,
   randomSample: _randomSample,
   randomOscs: _randomOscs
  }
});
