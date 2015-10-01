(function() {
    var app = angular.module('deviceWatch', ['btford.socket-io']); /*global angular*/

    app.factory('mySocket', function (socketFactory) {
        return socketFactory();
    });

    app.controller('AllDevice', function( $scope, mySocket ) {
        $scope.devices = {};
        
        mySocket.on('connect', function() {
            mySocket.emit('initalize data', function(livedata) {
                $scope.devices = livedata
            });
        });
        
        mySocket.on('signal', signal => {
           if (!(signal.name in $scope.devices)) {
                $scope.devices[signal.name] = {};
            }
            console.log( 'got a signal ' + signal.name + ", " + signal.key + ": " + signal.val )
            $scope.devices[signal.name][signal.key] = signal.val;
        } );
        

//        $scope.addDevice = function( name ) { 
//            $scope.devices[name] = { connected: true };
//       };
//        
//        this.deviceDisconnect = function( name ) {
//            if ('name' in this.devices) {
//               this.devices[name]['connected'] = false; 
//            }
//        }
    });
    
})();