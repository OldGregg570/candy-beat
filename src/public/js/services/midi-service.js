'use strict';

(function () {

    const MSG_NOTE_ON = 144;
    let app = angular.module('CandyBeatApp');

    app.factory('midi', function ($window) {
        let outputs = [];
        let midiAccess = null;
        return {
            getOutputs: function () {
                return outputs.map((out) => { return { name: out.value.name, id: out.value.id }});
            },
            init: function (midiMessageHandlers) {
                return new Promise((resolve, reject) => {

                    // Get access to the browser's midi API
                    $window.navigator.requestMIDIAccess().then(onSuccess, function onFailure (e) {
                        reject(e);
                    });

                    function onSuccess (midi) {
                        var outs = midi.outputs.values();
                        for(var output = outs.next(); output && !output.done; output = outs.next()) {
                            outputs.push(output);
                        }
                        midiAccess = midi;
                        resolve();
                    }
                });
            },
            playNote: function (note, outId, channel) {
                var noteOnMessage = [0x90, note, 0x7f];    // note on, middle C, full velocity
                var output = midiAccess.outputs.get(outId);
                output.send( noteOnMessage );  //omitting the timestamp means send immediately.
                output.send( [0x80, note, 0x40], window.performance.now() + 10 );
            }
        }
    });
})();
