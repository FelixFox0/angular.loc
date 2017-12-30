(function(angular) {
      'use strict';
    angular.module('app', ['ngResource'])
    .config(function($provide) {
        $provide.value('api_url', 'http://test/api/dropdown');
    })
    .factory('navFactory', function($http, api_url) {
        var factory = {};
        factory.getlist = function (myscope){
            return $http.get(api_url).then(function (response) {
                myscope.nav = response.data;
            })
        };
        factory.additem = function (item){
            var data = 'name='+item;
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }
            return $http.post(api_url, data, config);
        };
        return factory;
    })
    
    .directive('navMenu', function($rootScope) {
        return {
          scope: {cbModel: '=', cbNav: '='},
            link: function(scope) {
                scope.send = function() {$rootScope.$emit('additem')}
            },
            templateUrl: '/src/view/nav.html'
        };
      })
    .controller('Controller', ['$scope', '$rootScope', 'navFactory', function($scope, $rootScope, navFactory) {
        navFactory.getlist($scope);
        $scope.item = '';
        $scope.isOpened = false;
        $rootScope.$on('additem', function (event, data) {
            navFactory.additem($scope.item).then(function (response) {
                navFactory.getlist($scope);
                $scope.item = '';
            }, function(reason) {
                if (reason.status == 422 && reason.data.errors.name[0] !== undefined) {
                    alert(reason.data.errors.name[0]);
                }
            });
        });
    }]);
})(window.angular);

