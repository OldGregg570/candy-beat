angular.module('ngDropzone', []).directive('ngDropzone', function ($timeout) {
  return {
    restrict: 'AE',
    template: '<div ng-transclude></div>',
    transclude: true,
    scope: {
      dropzone: '=',
      eventHandlers: '=',
      onsuccess: '=',
      sample: '='
    },

    link: function(scope, element, attrs, ctrls) {

      var dropzone = new Dropzone(element[0], {
       url: '/sample',
       maxFiles: 1,
       init: function() {
        this.hiddenFileInput.removeAttribute('multiple');
        this.on("success", scope.onsuccess);
        this.on("addedfile", function(){
         if (this.files[1]) {
          this.removeFile(this.files[0]);
         }
        });
       },
       previewTemplate: '<div class="dz-preview dz-file-preview"></div>'
      });

      if (scope.eventHandlers) {
        Object.keys(scope.eventHandlers).forEach(function (eventName) {
          dropzone.on(eventName, scope.eventHandlers[eventName]);
        });
      }

      scope.dropzone = dropzone;
    }
  };
});
