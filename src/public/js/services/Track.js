
angular.module('CandyBeatApp').factory('Cell', function () {
  function Cell(c) {
    this.active = (c && c.active) || false;
  }

  Cell.prototype.toggle = function () {
    this.active = !this.active;
  }

  return Cell;
});

angular.module('CandyBeatApp').factory('Track', function (Cell, synthService){
  function Track(rows, cols, index, res, type, cb) {
   function fillArray(value, len) {
     var arr = [];
     for (var i = 0; i < len; i++) {
       arr.push(value);
     }
     return arr;
    }

    this.columns = [];
    this.index = index;
    this.resolution = res;
    this.locked = false;
    this.mute = false;
    this.solo = false;
    this.gain = 80;
    this.randomizer = {
     strategy: 'splatter',
     toggleChance: 0.1,
     clear: false,
     repeat: 2,
     rhythmFilter: fillArray(true, 64)
    };
    var that = this;

    var togRow = 0;
    var newCol;
    this.clear = function () {
     this.columns = [];
     for (var x = 0; x < cols; x++) {
       var col = [];
       newCol = true;
       for (var y = 0; y < rows; y++) {
         var c = new Cell ();
         if (x % 8 === 0 && y === togRow && newCol) {
          c.toggle ();
          togRow++;
          newCol = false;

         }
         col.push(c);
       }
       this.columns.push(col);
     }
   }

   function randInt (min, max) {
       return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   this.toggleRandom = function (column) {
    return function toggleRand () {
     column[randInt(0, column.length - 1)].toggle();
    }
   }

   this.clear();

   synthService.patches[type === 'sampler' ? 'generateRandomSampler' : 'generateRandomSynth'] (function (synths) {
     that.synthesizers = synths;
     if (cb) cb(that);
    });
  }

  return Track;
});
