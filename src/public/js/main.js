angular.module('CandyBeatApp', [
  'ngclipboard',
  'ngWavesurfer',
  'ngDropzone',
  'angularSpinner',
  'rzModule',
  'ui.bootstrap']);

angular.module('CandyBeatApp').directive('candymain', function() {
 return { restrict: 'E', scope: {}, controller: 'mainCtrl', templateUrl: './html/main.html' }
});

angular.module ('CandyBeatApp').controller ('mainCtrl',

function ($scope, $http, Namer, Track, Cell, $interval, synthService, music, $modal, $timeout, randomService, logger, randomizerService) {
  logger.verbose({ message: 'Welcome to Candy Beat', details: 'Click some stuff.', user: true })


  $scope.masterVolume = 60;
  $scope.tracks = [];
  $scope.activeColumn = 0;
  $scope.tempo = 60;
  $scope.songName = '';
  $scope.keys = music.keys;
  $scope.key = $scope.keys[0];
  $scope.phraseIndex = 0;
  $scope.scales = music.scales;
  $scope.scale = $scope.scales[0];
  $scope.volumeSlider = { floor: 0, ceil: 100, onChange: function() { $scope.onVolumeChange (); }};
  $scope.tempoSlider  = { floor: 1, ceil: 100, onEnd: function() { $scope.onTempoChange (); }};
  $scope.resolutions = ['sixty-fourth', 'thirty-second', 'sixteenth', 'eighth', 'quarter', 'half', 'whole' ];

  $scope.randomizing = false;

  $scope.tick = function tick () {
    function doLater (cell, fn) {
     return function () {
      if (fn === 'unplay') {
       delete cell.playing;
      } else {
       cell[fn]();
      }
     }
    }
    var soloTracks = $scope.tracks.filter(function(e) { return e.solo; });
    var tracks = (soloTracks.length > 0 ? soloTracks : $scope.tracks).filter(function(e) { return !e.mute; });

    for (var t in tracks) {
      var track = tracks[t];
      var r = Math.pow(2, track.resolution);
      for (var c in track.columns[$scope.activeColumn]) {
        var cell = track.columns[$scope.activeColumn][c];
        if ($scope.activeColumn % r === 0 && cell.active)  {
         synthService.playNote($scope.scale.notes[c], track.synthesizers[c % track.synthesizers.length], track.gain);
         cell.playing = true;
         $timeout(doLater(cell, 'unplay'), 500);
        }
      }
      if ($scope.activeColumn === 63) {
       if ($scope.phraseIndex % track.randomizer.repeat == 0 && $scope.randomizing) {
       randomizerService.randomize($scope.tracks[t]);
       }
      }
    }
    $scope.activeColumn++;
    if($scope.activeColumn >= 64) {
     $scope.activeColumn = 0;
     $scope.phraseIndex++;
   }
  }


  $scope.toggleRandomizer = function () {
   $scope.songName = Namer.newName(3);
   $scope.randomizing = true;
  }

  $scope.randomizeTracks = function () {
   var tracks =  $scope.tracks.filter(function (t) { return t.locked === false; });
   for (var t in tracks) {
    randomizerService.randomize($scope.tracks[t]);
   }
  }

  $scope.updateScale = function (index) {
    $scope.scale = index ? $scope.scales[index] : $scope.scale;
    $scope.scale.notes = music.generateScale($scope.key.val, $scope.scale.val, 8);
  };

  $scope.powerOfTwo = function (i) { return Math.pow(2, i);  }

  $scope.addTrack = function (type) {
   if ($scope.tracks.length < 8) {
    new Track(8, 64, $scope.tracks.length, 2, type, function (t) {
     $scope.tracks.push(t);
    });
   }
  }

  $scope.onVolumeChange = function () {
    synthService.setMasterVolume ($scope.masterVolume);
  }

  $scope.onTempoChange = function () {
    $interval.cancel($scope.currentInterval);
    delay = (60000 / $scope.tempo) / 16;
    $scope.currentInterval = $interval($scope.tick, delay);
  }

  $scope.saveSong = function () {

    if ($scope.songName !== '') {
     $http.post ('/songs/', {
      name: $scope.songName,
      settings: {
       key: $scope.key,
       scale: $scope.scale
      },
      tracks: encodeTracks(JSON.parse(JSON.stringify($scope.tracks)))
     });
    } else {
     logger.info({ message: 'No Song Title', details: 'Enter a title to save this song. ', user: true })
    }

    function encodeTracks (tracks) {
     function encodeColumns (cols) {
      var encoded = '';
      for (var col in cols) {
       var binaryCol = '';

       for (var cell in cols[col]) {
        binaryCol += cols[col][cell].active == true ? '1' : '0';
       }

       encoded += parseInt(binaryCol, 2).toString(36) + ' ';
      }
      return encoded.trim();
     }

     return tracks.map(function (t) {
      t.columns = encodeColumns(t.columns);
      return t;
     });
    }


  }

  $scope.loadSong = function () {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: '/html/songs.html',
      controller: 'OpenSongCtrl',
      size: 'lg'
    });

    function decodeTracks (tracks) {
     function decodeColumns(cols) {
      var decodedColumns = [];
      var encodedColumns = cols.split(' ');
      for (var encodedCol in encodedColumns) {
       var newCol = [];

       binaryCol = parseInt(encodedColumns[encodedCol], 36).toString(2);
       binaryCol = '0'.repeat(8 - binaryCol.length) + binaryCol;

       for (var i in binaryCol) {
        newCol.push(new Cell({ active: binaryCol[i] === '1' }));
       }
       decodedColumns.push(newCol);
      }

      return decodedColumns;
     }

     return tracks.map (function (t) {
      t.columns = decodeColumns (t.columns);
      return t;
     });
    }

    modalInstance.result.then(function (id) {
      $http.get ('/songs/' + id + '/').success(function (song) {
        $scope.songName = song.name;
        $scope.tracks = decodeTracks(song.tracks);
        $scope.key = $scope.keys [song.settings.key.val];
        $scope.updateScale (song.settings.scale.index);
      });
    },
    function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  }

  $scope.openTrackSettings = function (track) {
   var modalInstanccee = $modal.open({
    animation: true,
    templateUrl: '/html/track-settings.html',
    controller: 'TrackSettingsCtrl',
    size: 'lg',
    resolve: {
     track: function () { return track; }
    }
   });
  }

  $scope.openAnalyser = function () {
   var modalInstance = $modal.open({
     animation: true,
     templateUrl: '/html/analyser.html',
     controller: 'AnalyserCtrl',
     size: 'lg'
   });
  }

  $scope.toggleCell = function (track, cell, colIndex) {
    var r = Math.pow (2, track.resolution);
    track.columns[r * Math.floor(colIndex / r)][cell].toggle();
  }

  $scope.cellClass = function (track, cell, col) {
   var r = Math.pow (2, track.resolution);
   var retClass =  (col + 1) % r === 0 ? 'grid-cell ' : 'grid-cell-joined ';
   retClass += track.columns[r * Math.floor(col / r)][cell].active ? 'grid-cell-active' : 'grid-cell-inactive';
   retClass += track.columns[r * Math.floor(col / r)][cell].playing ? ' grid-cell-playing' : '';
   retClass += track.synthesizers[0].type === 'synth' ? ' grid-cell-synth' : ' grid-cell-sampler';
   return retClass;
  }


  $scope.updateScale ();
  $scope.onTempoChange();
  $scope.addTrack ('synth');
});

angular.module('CandyBeatApp').directive('toolbar', function () {
 return { scope: false, templateUrl: '/html/templates/toolbar.html' }
});

angular.module('CandyBeatApp').directive('trackcontrols', function () {
 return { scope: false, templateUrl: '/html/templates/track-dropdown.html' }
});

angular.module('CandyBeatApp').directive('mixer', function () {
 return { scope: false, templateUrl: '/html/templates/mixer.html' }
});

angular.module('CandyBeatApp').directive('mainmenu', function () {
 return { scope: false, templateUrl: '/html/templates/main-menu.html' }
});