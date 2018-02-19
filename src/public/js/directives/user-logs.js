angular.module('CandyBeatApp').directive('userlog', function(){
    return {
        restrict: 'E',
        scope: {},
        controller: 'userLogCtrl',
        templateUrl: './html/templates/user-logs.html'
    }
});

angular.module('CandyBeatApp').controller('userLogCtrl', function tutorialGalleryCtrl($rootScope, $scope, logger){
    $scope.logger = logger;

    $scope.logAction = function (log) {
        $rootScope.$broadcast(log.action.event, log.action.params || {});
        if (log.action.close || false) {
            $scope.logger.clearLogs();
        }
    };
});
