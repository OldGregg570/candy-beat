angular.module('CandyBeatApp').factory('logger', function($window) {

    var LVL_MAP = { silly: 0, debug: 1, verbose: 2, info: 3, warning: 4, error: 5 };


    var loggerService = {
        silly:   function(data) { post(data, 'silly'); },
        debug:   function(data) { post(data, 'debug'); },
        verbose: function(data) { post(data, 'verbose'); },
        info:    function(data) { post(data, 'info'); },
        warning: function(data) { post(data, 'warning'); },
        error:   function(data) { post(data, 'error'); }
    };

    loggerService.userLogs = [];
    loggerService.logLevel = 'info';

    loggerService.pushLog = function (data) {
      var type_map = { silly: '', debug: '', verbose: 'info', info: 'success', warning: 'warning', error: 'danger' };

      // Logs with the same log message will have their count incremented
      if(loggerService.userLogs.filter(function(e) { return e.msg === data.message; }).length === 0) {
        loggerService.userLogs.push ({
            msg: data.message,
            type: type_map[data.type],
            details: data.details || '',
            isCollapsed: true,
            action: data.action || null,
            icon: data.icon,
            count: 1
        });
      } else {
        loggerService.userLogs.filter(function(e) { return e.msg === data.message; })[0].count += 1;
      }
    };

    loggerService.removeLog = function(index) {
     loggerService.userLogs.splice(index, 1);
    };

    loggerService.clearLogs = function () {
     loggerService.userLogs = [];
    };

    function new_post_body (data, type) {
     return angular.toJson({
       url: $window.location.href,
       data: data,
       type: type
     });
    }

    function post (data, type) {

      data.type = type;
      if (data.user && LVL_MAP[type] >= LVL_MAP[loggerService.logLevel]) {
          loggerService.pushLog(data);
      }
    }

    return loggerService;
});
