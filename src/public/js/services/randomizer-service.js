
angular.module('CandyBeatApp').factory('randomizerService', function (randomService) {


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
  var note = randomService.randInt(0, 7);

  forEachCol(track, function (col, x) {
   col[note].toggle();
   note += 2;
   note %= 8;
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
