angular.module('CandyBeatApp').factory('music', function() {
  var music = {};
  var scales = {
    pent_minor :      [0, 3, 5, 7, 10],
    pent_major :      [0, 2, 4, 7, 9],
    pent_suspended :  [0, 2, 5, 7, 10],
    pent_mangong :    [0, 3, 5, 8, 10],
    pent_ritusen :    [0, 2, 5, 7, 9],
    blues :           [0, 3, 5, 6, 7, 10],
    whole_tone :      [0, 2, 4, 6, 8, 10],
    ionian :          [0, 2, 4, 5, 7, 9, 11],
    dorian :          [0, 2, 3, 5, 7, 9, 10],
    phrygian :        [0, 1, 3, 5, 7, 8, 10],
    lydian:           [0, 2, 4, 6, 7, 9, 11],
    mixolydian :      [0, 2, 4, 5, 7, 9, 10],
    aeolian :         [0, 2, 3, 5, 7, 8, 10],
    locrian :         [0, 1, 3, 5, 6, 8, 10],
    augmented :       [0, 1, 3, 4, 6, 8, 10],
    harmonic_minor :  [0, 2, 3, 5, 7, 8, 11],
    diminished :      [0, 1, 3, 4, 6, 7, 9, 10],
    chromatic :       [0, 1, 2, 3, 4, 5, 6, 7, 8 , 9, 10, 11]
  };

  music.C4 = 60;
  music.oscTypes = ['sine', 'sawtooth', 'triangle', 'square', 'noise'];
  music.typeVals = { 'sine' : 0, 'sawtooth' : 1, 'triangle' : 2, 'square' : 3, 'noise' : 4 };

  music.generateScale = function generateScale (base, name, count) {
    var scale = scales[name];
    var retVal = [];

    // we are going to add it back each time the scale wraps
    base -= 12;
    for (var i = 0; i < count; i++) {

      // wrap the scale index
      var scaleIndex = i % scale.length

      // increment by an octave
      if (scaleIndex === 0) {
        base += 12;
      }

      // scale note is offest by the base note
      retVal.push(base + scale[scaleIndex]);
    }
    return retVal;
  };

  music.keys = [
    {name: "C",  val:   0},
    {name: "C#", val:   1},
    {name: "D",  val:   2},
    {name: "D#", val:   3},
    {name: "E",  val:   4},
    {name: "F",  val:   5},
    {name: "F#", val:   6},
    {name: "G",  val:   7},
    {name: "G#", val:   8},
    {name: "A",  val:   9},
    {name: "A#", val:   10},
    {name: "B",  val:   11}
  ];

  music.octaves = [
    {name: "0", val: 0},
    {name: "1", val: 1},
    {name: "2", val: 2},
    {name: "3", val: 3},
    {name: "4", val: 4},
    {name: "5", val: 5},
    {name: "6", val: 6},
    {name: "7", val: 7},
    {name: "8", val: 8},
    {name: "9", val: 9},
    {name: "10", val: 10},
    {name: "11", val: 11}
  ];

  music.scales = [

    { name: "Minor Pentatonic",      val: "pent_minor", index: 0 },
    { name: "Major Pentatonic",      val: "pent_major", index: 1 },
    { name: "Suspended Pentatonic",  val: "pent_suspended", index: 2 },
    { name: "Man Gong Pentatonic",   val: "pent_mangong", index: 3 },
    { name: "Ritusen Pentatonic",    val: "pent_ritusen", index: 4 },
    { name: "Blues",                 val: "blues", index: 5 },
    { name: "Whole Tone",            val: "whole_tone", index: 6 },
    { name: "Ionian",                val: "ionian", index: 7 },
    { name: "Aeolian",               val: "aeolian", index: 8 },
    { name: "Lydian",                val: "lydian", index: 9 },
    { name: "Mixolydian",            val: "mixolydian", index: 10 },
    { name: "Dorian",                val: "dorian", index: 11 },
    { name: "Phrygian",              val: "phrygian", index: 12 },
    { name: "Harmonic Minor",        val: "harmonic_minor", index: 13 },
    { name: "Diminished",            val: "diminished", index: 14 },
    { name: "Chromatic",             val: "chromatic", index: 15 }
  ];

  music.instrumentSets = [
    {
      name: 'Keyboard',
      val : [
        { name: 'Electric Piano 1',       val: "electric_piano_1" },
        { name: 'Glockenspiel',           val: "glockenspiel" },
        { name: 'Vibraphone',             val: "vibraphone" }
      ]
    },

    {
      name: 'Guitar',
      val : [
        { name: 'Acoustic Guitar (nylon)', val: "acoustic_guitar_nylon" },
        { name: 'Distortion Guitar', val: "distortion_guitar" }
      ]
    },

    {
      name: 'Orchestral',
      val : [
        { name: 'Orchestral Harp', val: "orchestral_harp" },
        { name: 'String Ensemble 1', val: "string_ensemble_1" }
      ]
    },

    {
      name: 'Monophones',
      val : [
        { name: 'Brass Section', val: "brass_section" },
        { name: 'Tenor Sax', val: "tenor_sax" },
        { name: 'Flute', val: "flute" }
      ]
    }
  ];

  return music;
});
