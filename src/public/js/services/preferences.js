'use strict';

(function () {

    const MSG_NOTE_ON = 144;
    let app = angular.module('CandyBeatApp');


    app.service('synthPreferences', function ($window) {
        let currentMidiOutput;

        return {
            currentMidiOutput
        }
    });

    app.controller('PreferencesCtrl', function ($scope, synthPreferences) {
        $scope.preferences = synthPreferences;
    });
})();
