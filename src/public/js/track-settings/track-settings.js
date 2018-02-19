angular.module('CandyBeatApp').filter('sampleName', function () {
 return function (input) {
  function initialCaps (e) {
   var first = e.slice(0, 1);
   return first.toUpperCase() + e.substring(1);
  }
  return input.split('.')[0].split('_').splice(1, input.split('_').length).join (' ');
 }
});

angular.module('CandyBeatApp').controller('SaveSynthCtrl', function ($scope, $modalInstance) {
  $scope.patchName = '';

  $scope.confirmSave = function (name) {
    $modalInstance.close(name);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss ('cancel');
  };
});

angular.module('CandyBeatApp').controller('TrackSettingsCtrl', function ($modal, $scope, $modalInstance, synthService, track, $timeout, logger, randomizerService, $sce, Cell, midi) {
    $scope.powerOfTwo = function (i) { return Math.pow(2, i);  };

    $scope.midiOutputs = midi.getOutputs();

    if (!$scope.midiOutputs[0].internal) {
        $scope.midiOutputs.unshift({name: "Internal", internal: true, id: "INTERNAL" });
    }

    console.log($scope.midiOutputs);

    $scope.track = track;
    $scope.currentSynth = 0;
    $scope.synthType = $scope.track.synthesizers[0].type === 'synth';
    $scope.patches = [];
    $scope.samples = [];
    $scope.randomizerService = randomizerService;
    $scope.tooltips = {
    randomizer_splatter_persistence : $sce.trustAsHtml("<p>When set to <b>Clear</b>, expect a simillar number of cells to be active for each generation.</p>" +
                                          "<p>When set to <b>Compound</b>, expect the number of active cells to gradually increase until about half are active.</p>")
    }

    $scope.loadGrid = function (grid) {
        $scope.track.columns = grid.columns;
        $scope.track.color = grid.color;
        $scope.track.resolution = grid.resolution;
    }

  $scope.ratioToPercent = function (ratio) {
   return Math.floor(ratio * 100);
  }

  if ($scope.synthType) {
   logger.verbose({ message: 'Synthesizer Settings', details: 'Twist some knobs!', user: true })
  } else {
   logger.verbose({ message: 'Sampler Settings', details: 'Drag and drop your audio samples here!', user: true })
  }

  $scope.$on('wavesurferInit', function (e, wavesurfer) {
   $scope.wavesurfer = wavesurfer;
  });

  $scope.resolutionSliderOptions = {
   floor: 0,
   ceil: 6,
   showTicks: true,
   hideLimitLabels: true,
   showTicksValues: false
  };

  $scope.selectMidiOut = function () {
          console.log($scope.track.midiOutput);
  };

  $scope.selectedSample = $scope.track.synthesizers[$scope.currentSynth].oscs[0].sample;

  $scope.sampleUploaded = function (file, response) {
    $scope.selectedSample = response.fname;
    $scope.loadSample (response.fname);
  }

  $scope.loadSample = function (fname) {
   synthService.getSample(fname).then(function (data) {
    $scope.track.synthesizers[$scope.currentSynth].oscs[0].sample = { name: fname, audioBuffer: data };
    $scope.wavesurfer.load(fname);
   });
  };

  $scope.lfoDestinations = [
   'osc-2.frequency',
   'filter.cutoff'
  ];

  $scope.cancel = function () {
    $modalInstance.dismiss ('cancel');
  }
  $scope.addSynthesizer = function () {
   if ($scope.track.synthesizers.length < 8) {
    synthService.patches.generateRandomSynth(function (synth) {
     $scope.track.synthesizers.push(synth);
    });
   }
  }

  $scope.removeSynthesizer = function () {
   if ($scope.track.synthesizers.length > 1) {
    $scope.track.synthesizers.splice($scope.currentSynth, 1);
    if ($scope.currentSynth >= $scope.track.synthesizers.length) {
     $scope.currentSynth--;
    }
   }
  }

  $scope.setPage = function (pageIndex) {
   $scope.currentSynth = pageIndex;
   $scope.drawEnvelope ();
  }
  $scope.cellClass = function (cell) {
   var retClass = cell.active ? 'grid-cell-active' : 'grid-cell-inactive';
   retClass += cell.playing ? ' grid-cell-playing' : '';
   return retClass;
  }
  $scope.randomize = function (synth) {
   var generatorFunction = {
    'sampler' : synthService.patches.generateRandomSampler,
    'synth' : synthService.patches.generateRandomSynth
   } [synth.type];

   generatorFunction (function (synths) {
    $scope.track.synthesizers = synths;
    $scope.setPage(0);
    $timeout($scope.drawEnvelope, 10);
   });
  }

  $scope.setType = function (synth) {
   $scope.randomize(synth);
  }

  $scope.getResolutionIcon = function () {
   var icons = { 6: 'icon-whole', 5: 'icon-half', 4: 'icon-quarter', 3: 'icon-eighth', 2: 'icon-sixteenth', 1: 'icon-thirty-second', 0: 'icon-sixty-fourth' }
   return icons[$scope.track.resolution];
  }

  $scope.drawEnvelope = function () {
   var element = $(".env-canvas" + $scope.currentSynth).get();
   // If the canvas isn't ready, wait a bit
   if (!element[0]) {
    console.log ('no element found');
    $timeout($scope.drawEnvelope, 10);
   } else {
    drawEnvelope (element[0]);
   }

   function drawEnvelope (e) {
    var w = e.width;
    var h = e.height;
    var env = $scope.track.synthesizers[$scope.currentSynth].envelope;
    var ctx = e.getContext('2d');
    var drawing = false;
    var peak = w * (env.attack / (env.attack + env.release + env.sustain));
    var release = w - (w * (env.release / (env.attack + env.release + env.sustain)));
    ctx.lineJoin = 'round';
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 3;
    ctx.strokeStyle="#cccccc";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, h);
    ctx.lineTo(w, h);
    ctx.stroke();
    ctx.strokeStyle="#ee8888";
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(peak, 0);
    ctx.stroke();
    ctx.strokeStyle="#88ee88";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(peak, 0);
    ctx.lineTo(release, 0);
    ctx.stroke();
    ctx.strokeStyle="#8888ee";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(release, 0);
    ctx.lineTo(w, h);
    ctx.stroke();
   }
  }

  $scope.drawEnvelope ();
});


angular.module('CandyBeatApp').directive('settingssynth', function() {
    return { scope: false, templateUrl: './src/public/html/templates/settings-synthesizer.html' }
});

angular.module('CandyBeatApp').directive('settingsoscs', function() {
    return { scope: false, templateUrl: './src/public/html/templates/settings-oscs.html' }
});

angular.module('CandyBeatApp').directive('settingssampler', function() {
    return { scope: false, templateUrl: './src/public/html/templates/settings-sampler.html' }
});

angular.module('CandyBeatApp').directive('randomizersettings', function() {
    return { scope: false, templateUrl: './src/public/html/templates/randomizer-settings.html' }
});

angular.module('CandyBeatApp').directive('randomsplatter', function() {
    return { scope: false, templateUrl: './src/public/html/templates/randomizer/splatter.html' }
});

angular.module('CandyBeatApp').directive('randomphrase', function() {
    return { scope: false, templateUrl: './src/public/html/templates/randomizer/phrase.html' }
});
