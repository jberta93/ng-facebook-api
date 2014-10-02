'use strict';

angular.module('exampleApp')
  .controller('MainCtrl', function ($scope, facebook) {
    $scope.results = [];
    
    $scope.onClick = function(){
    	facebook.getUser().then(function(r){
    		$scope.results = r.fields;
    	});
    }
    
  });
