angular.module('CandyBeatApp').controller('OpenSongCtrl', function ($http, $scope, $modalInstance) {
  $scope.songs = null;

  $http.get('/songs/').success(function (songs) {
    $scope.songs = songs;
  }).error(function (err) {

  });

  $scope.loadSong = function (id) {
    $modalInstance.close(id)
  }

  $scope.cancel = function () {
    $modalInstance.dismiss ('cancel');
  }
});
