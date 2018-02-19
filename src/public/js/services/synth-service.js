
angular.module('CandyBeatApp').factory('synthService', function ($window, music, $q, patchService) {
 var ctx = new AudioContext();
 var analyserJsNode = ctx.createScriptProcessor(1024, 1, 1);
 var NOISE_SIZE = 4096;
 analyserJsNode.connect(ctx.destination);

 var analyser = ctx.createAnalyser();

 analyser.smoothingTimeConstant = 0.5;
 analyser.fftSizer = 256;
 analyser.minDecibels = -85;

 var masterVolume = 0.5;

 function playNote (note, synthesizer, trackGain) {
   var oscIndex = 0;
   var envelopeVco = ctx.createGain();
   var now = ctx.currentTime;
   var s = synthesizer.envelope.sustain / 1000.0;
   var a = synthesizer.envelope.attack / 1000.0;
   var r = synthesizer.envelope.release / 1000.0;
   var oscCount = synthesizer.oscs.length;
   var filter = ctx.createBiquadFilter();
   var lfo = ctx.createOscillator();
   var lfoGain = ctx.createGain ();

   lfo.frequency.value = synthesizer.lfo.frequency;
   lfoGain.gain.value = synthesizer.lfo.level;
   lfo.connect(lfoGain);

   synthesizer.oscs.forEach (function (settings) {
    var oscVco = ctx.createGain();
    var soundNode;
    oscVco.connect(filter);
    oscVco.gain.value = (masterVolume * settings.volume / 100 * (1 / oscCount));

    if (settings.sample) {
      soundNode = ctx.createBufferSource();
      soundNode.buffer = settings.sample.audioBuffer || settings.sample.arrayBuffer;
    } else {

    if (settings.type === 'noise') {
     var bufferSize = 2 * ctx.sampleRate,
     noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate),
     output = noiseBuffer.getChannelData(0);
     for (var i = 0; i < bufferSize; i++) {
         output[i] = Math.random() * 2 - 1;
     }
     soundNode = ctx.createBufferSource();
     soundNode.buffer = noiseBuffer;
     soundNode.loop = true;
    } else {
     soundNode = ctx.createOscillator();
     soundNode.type = settings.type;
     soundNode.frequency.value = (440.0 * Math.pow(2, (((note + settings.harmony + (12 * settings.octave)) - 69) / 12))) + settings.detune;
     if (oscIndex == 1 && synthesizer.lfo.destination.indexOf('osc-2') >= 0) {
      lfoGain.connect(soundNode.frequency);
     }
    }
   }
   soundNode.connect(oscVco);


   soundNode.start(now);
   soundNode.stop(now + s + r);

   oscIndex++;
  });

  if (synthesizer.lfo.destination.indexOf('filter.cutoff') >= 0) {
   lfoGain.gain.value = synthesizer.lfo.level * 200;
   lfoGain.connect (filter.frequency);
  }

  filter.frequency.value = synthesizer.filter.cutoff;
  filter.type = synthesizer.filter.type;

  filter.connect(envelopeVco);
  envelopeVco.connect(analyser);
  analyser.connect(analyserJsNode);

  envelopeVco.connect(ctx.destination);

  envelopeVco.gain.setValueAtTime(0.00001, now);
  envelopeVco.gain.linearRampToValueAtTime((synthesizer.gain / 100) * (trackGain / 100), now + a);
  envelopeVco.gain.linearRampToValueAtTime(0, now + s + r);

  lfo.start(now);
  lfo.stop(now + s + r);
 }

 return {
  getAnalyserData: function () {
   var a = new Uint8Array(analyser.frequencyBinCount);
   analyser.getByteFrequencyData(a);
   return a;
  },
  playNote:        playNote,
  setMasterVolume: function (volume) {
     masterVolume =  volume / 50.0;
    },
  patches: {
   generateRandomSampler: patchService.generate808,
   generateRandomSynth:   patchService.generateRandomSynth,
   randomOscs:               patchService.randomOscs,
   randomSample:             patchService.randomSample
  },
  getSample: patchService.getDecodePromise
 }
});
