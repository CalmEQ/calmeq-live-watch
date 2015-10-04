(function() {
    var app = angular.module('deviceWatch', ['btford.socket-io', 'uiGmapgoogle-maps']); /*global angular*/

    app.factory('mySocket', function (socketFactory) {
        return socketFactory();
    });

    app.config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyADBrHDk2telNSBAdKCOTunANdjzQUbTYQ',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    });
    
    app.controller('AllDevice', function( $scope, mySocket ) {
        $scope.devicedata = [];
        $scope.devicemap = {};
        
        $scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 1 };

        mySocket.on('connect', function() {
            mySocket.emit('initalize data', function(devicedata, devicemap) {
                $scope.devicedata = devicedata;
                $scope.devicemap = devicemap;
            });
        });
        
        mySocket.on('signal', signal => {
           if ( !(signal.name in $scope.devicemap)) {
                var myid = $scope.devicedata.push( { name: signal.name} ) - 1;
                $scope.devicemap[signal.name] = myid;
            } else {
                var myid = $scope.devicemap[signal.name];
            }
            
            console.log( 'got a signal ' + signal.name + ", " + signal.key + ": " + signal.val );
            $scope.devicedata[myid][signal.key] = signal.val;
            
            // $scope.markers = [];
            // Object.keys($scope.devices).forEach(function (key) {
            //     var val = $scope.devices[key];
            //     if ( 'latitude' in val && 'longitude' in val ) {
            //         $scope.markers.push( { id: key, latitude: val.latitude, longitude: val.longitude } );
            //     };
            // });
        });
        

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