
angular.module('CandyBeatApp').factory('randomizerService', function (randomService) {

 function clip (val, min, max) {
  if (val > max) return max;
  if (val < min) return min;
  return val;
 }

 function forEachCell (col, fn) {
   for (var l in col) {
     var cell = col[l];
     if (l !== '$$hashKey') {
      fn(cell, l);
    }
  }
 }

 function forEachCol (track, fn) {
  for (var c in track.columns) {
   fn(track.columns[c], c);
  }
 }

 function _randomizeSplatter(track) {
  forEachCol (track, function (col, x) {
   forEachCell (col, function (cell, y) {
    if (randomService.probability (track.randomizer.toggleChance) && track.randomizer.rhythmFilter [x]) {
        cell.toggle ();
    }
   });
  });
 }

 function _randomizePhrase (track) {
  var note = randomService.randInt (0, 7);
  var r = Math.pow(2, track.resolution);

  forEachCol(track, function (col, x) {
   if (x % r == 0 && track.randomizer.rhythmFilter[x]) {
    col[note].toggle();
    note += randomService.randInt(-track.randomizer.maxInterval, track.randomizer.maxInterval);
    note = clip(note, 0, 7);
   }
  });
 }

 var randomizeFunctions = {
  splatter: _randomizeSplatter,
  phrase: _randomizePhrase
 }

 return {
  strategies: ['splatter', 'phrase'],
  randomize: function (track) {
   forEachCol (track, function (col, x) {
    forEachCell (col, function (cell, y) {
     if (track.randomizer.clear) cell.active = false;
    });
   });

   randomizeFunctions[track.randomizer.strategy](track);
  }
 }
});
