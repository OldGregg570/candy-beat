angular.module('CandyBeatApp').directive('knob', function($compile, music) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      var val = scope.$eval(attrs.value);

      var k = {
         width: 80,
         height: 80,
         change: function (v) {
           setKnob(Math.floor(v + 0.5), attrs.knobtype);
         }
      };

      function setKnob (v, knobtype) {
       scope.$apply(function () {
        console.log(v);
        scope.track.synthesizers[scope.currentSynth].oscs[scope.$eval(attrs.oscindex)][knobtype] = v;
       });
      }

      if (attrs.knobtype === 'octave') {
       k['min'] = 1;
       k['max'] = 12;
       k['cursor'] = 20;
       k['angleArc'] = 120;
       k['angleOffset'] = -60;
       k['fgColor'] = '#cc66aa';
       k['inputColor'] = '#cc66aa';
      } else if (attrs.knobtype === 'type') {
       k['displayInput'] = false;
       k['max'] = 5;
       k['cursor'] = 72;
       val = music.typeVals [val];
       k['change'] = function (v) {
        setKnob(music.oscTypes[Math.floor(v + 0.5) % music.oscTypes.length], 'type');
       }
       k['fgColor'] = '#7766cc';
       k['inputColor'] = '#7766cc';
      } else if (attrs.knobtype === 'harmony') {
       k['min'] = -12;
       k['max'] = 12;
       k['angleOffset'] = -60;
       k['angleArc'] = 120;
       k['cursor'] = 10;
       k['fgColor'] = '#ddaaaa';
       k['inputColor'] = '#ddaaaa';
      } else if (attrs.knobtype === 'detune') {
       k['min'] = -100;
       k['max'] = 100;
       k['angleOffset'] = -120;
       k['angleArc'] = 240;
       k['cursor'] = 10;
       k['fgColor'] = '#aaddaa';
       k['inputColor'] = '#aaddaa';
      } else if (attrs.knobtype === 'volume') {
       k['fgColor'] = '#ccbb88';
       k['inputColor'] = '#ccbb88';
      } else if (attrs.knobtype === 'cutoff') {
       k['min'] = 0;
       k['max'] = 20000;
       k['width'] = 200;
       k['height'] = 100;
       k['angleArc'] = 180;
       k['angleOffset'] = -90;
       k['fgColor'] = '#cc8866';
       k['inputColor'] = '#cc8866';
       k['change'] = function (v) {
        scope.$apply(function () {
         scope.track.synthesizers[scope.currentSynth].filter.cutoff = Math.floor(v);
        });
       }
      } else if (attrs.knobtype === 'attack' || attrs.knobtype === 'release' || attrs.knobtype === 'sustain') {
       k['min'] = 0;
       k['max'] = 2000;
       k['fgColor'] = {'attack': '#ee8888', 'sustain': '#88ee88', 'release':'#8888ee'}[attrs.knobtype];
       k['change'] = function (v) {
        scope.$apply(function () {
         scope.track.synthesizers[scope.currentSynth].envelope [attrs.knobtype] = Math.floor(v);
         scope.drawEnvelope();
        });
       }
      } else if (attrs.knobtype === 'lfo-frequency') {
       k['min'] = 0.0;
       k['step'] = 0.1;
       k['max'] = 12.0;
       k['change'] = function (v) {
        scope.$apply(function () {
         scope.track.synthesizers[scope.currentSynth].lfo.frequency = v;
        });
       }
      } else if (attrs.knobtype === 'lfo-gain') {
       k['min'] = -100;
       k['angleArc'] = 320;
       k['angleOffset'] = -160;
       k['cursor'] = 10;
       k['change'] = function (v) {
        scope.$apply(function () {
         scope.track.synthesizers[scope.currentSynth].lfo.level = Math.floor(v);
        });
       }
      } else if (attrs.knobtype === 'master-gain') {
       k['width'] = 200;
       k['height'] = 100;
       k['max'] = 800;
       k['angleArc'] = 180;
       k['angleOffset'] = -90;
       k['fgColor'] = '#cccc00';
       k['change'] = function (v) {
        scope.$apply(function () {
         scope.track.synthesizers[scope.currentSynth].gain = Math.floor(v);
        });
       }
      } else if (attrs.knobtype === 'track-gain') {
       k['angleArc'] = 320;
       k['angleOffset'] = -160;
       k['cursor'] = 10;
       k['bgColor'] = '#cccccc';
       k['fgColor'] = '#cc66aa';
       k['change'] = function (v) {
        scope.$apply(function () {
         scope.track.gain = Math.floor(v);
        });
       }
      }

      $(element).val(val).knob(k);
    }
  };
});
