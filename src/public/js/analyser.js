angular.module('CandyBeatApp').controller('AnalyserCtrl', function ($http, $timeout, $scope, $modalInstance, $interval, synthService) {

 function drawSpectrum(gctx, arr) {
   for (var i = 0; i < (arr.length); i += 1 ){
     var value = arr[i];
     gctx.globalAlpha = 0.6;
     gctx.fillStyle = "#cc66aa";
     gctx.fillRect(Math.floor(Math.pow(i, 0.8625)), Math.max(0, 145 - (value / 2.0)) - 2, 1, 325);
   }
   gctx.clearRect(0, 148, 1000, 325);

   for (var i = 0; i < (arr.length); i += 1 ){
     var value = arr[i];

     gctx.globalAlpha = 1;
     gctx.fillStyle = "#888888";
     if (i % 64 === 0) {
      gctx.fillRect(Math.floor(Math.pow(i, 0.8625)), 148, 1, 10)
     }
   }
 };

 $scope.currentInterval = null;

 $scope.drawSpectrum  = function () {
  var element = $(".analyser-canvas").get();
  // If the canvas isn't ready, wait a bit
  if (!element[0]) {
   $timeout($scope.drawSpectrum, 10);
  } else {
   var gctx = element[0].getContext("2d");

   $scope.currentInterval = $interval(function () {
    gctx.clearRect(0, 0, 1000, 325);
    drawSpectrum (gctx, synthService.getAnalyserData());
   }, 10);
  }
 }

 $scope.drawSpectrum ();

 $scope.calcLabelOffset = function (k) {
  return [20, 115, 191, 266, 336, 403, 469, 533, 597, 659, 719, 778][k];
 }

 $scope.cancel = function () {
  $interval.cancel($scope.currentInterval);
  $modalInstance.dismiss ('cancel');
 }
});
