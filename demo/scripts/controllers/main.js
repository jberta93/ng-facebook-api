'use strict';

angular.module('exampleApp')
  .controller('MainCtrl', function ($rootScope,$scope, facebook) {
    $scope.results = [];
    $rootScope.$on("fb.init",function(){
    	console.log("SDK Ready");
    });
    
    $scope.getPublicProfile = function(){
    	facebook.getUser().then(function(r){
    		$scope.results = r.user;
    	});
    }
    $scope.img = "";
    
    $scope.getProfilePicture = function(){
    	facebook.getUserPicture("me",{width:300, height:300}).then(function(r){
    		$scope.img = r.picture.url;
    	});
    }
    
    
    $scope.form = {method:'GET',path: "/me/feed"};
    $scope.api = function(){
    	facebook.api($scope.form.path, facebook.API_METHOD[$scope.form.method]).then(function(resp){
    		console.log("Success!");
    		console.log(resp);
    	})
    }
    
    
  });
