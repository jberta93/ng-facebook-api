'use strict';

angular.module('exampleApp')
  .controller('MainCtrl', function ($scope, facebook) {
    $scope.results = [];
    
    
    $scope.getPublicProfile = function(){
    	facebook.getUser().then(function(r){
    		$scope.results = r.fields;
    	});
    }
    $scope.img = "";
    
    $scope.getProfilePicture = function(){
    	facebook.getUserPicture({fields:{width:300, height:300}}).then(function(r){
    		$scope.img = r.picture.url;
    	});
    }
    
    
    $scope.form = {method:'GET',path: "/354527374712983/feed"};
    $scope.api = function(){
    	facebook.api($scope.form.path, facebook.API_METHOD[$scope.form.method]).then(function(resp){
    		console.log("Success!");
    		console.log(resp);
    	})
    }
    
    
  });
