angular.module('CandyBeatApp').factory('randomService', function () {
  return {
   randInt: function (min, max) {
    if (!min) min = 0;
    if (!max) max = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
   },
   randIntLinear: function(min, max) {
    if (!min) min = 0;
    if (!max) max = 1;
    return Math.floor((max - min) * Math.abs(Math.random() - Math.random())) + min;
   },
   randFloat: function(min, max) {
    if (!min) min = 0;
    if (!max) max = 1;
    return Math.random() * max + min;
   },
   randFloatLinear: function(min, max) {
    if (!min) min = 0;
    if (!max) max = 1;
    return Math.abs(Math.random() - Math.random()) * (max - min) + min;
   },
   randFloatNormal: function(mu, sigma, nsamples){
      if(!nsamples) nsamples = 6
      if(!sigma) sigma = 1
      if(!mu) mu = 0

      var run_total = 0
      for(var i = 0 ; i < nsamples ; i++){
         run_total += Math.random()
      }

      return sigma * (run_total - nsamples / 2) / (nsamples / 2) + mu
   },
   select: function (arr) {
     return arr[Math.floor((Math.random() * arr.length))];
   },
   probability: function (p) {
    return Math.random() < p;
   }

  }
});
