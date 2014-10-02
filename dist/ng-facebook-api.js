/**
 * @Author: Lorenzo Bertacchi (www.lorenzobertacchi.it)
 */

'use strict';

angular.module('ng-facebook-api', []).service('Facebook', function Facebook($q) {
	  
	  var settings = {};
	  var currentUserAuthResponse = null;
	  var API_METHOD = {GET: "get", POST: "post", DELETE: "delete"}
	  
	  var init = function(permissions){
		  settings.permissions = permissions;
	  }
	  
	  
	  var getUser = function(fields){
		  var deferred = $q.defer();
		  if(typeof(fields) === "undefined"){
			  fields = {};
		  }
		  api("/me/",API_METHOD.GET,fields).then(function(response){
			  deferred.resolve({fields:response,authResponse: currentUserAuthResponse});
		  },function(err){
			  deferred.reject(err);
		  });
		  
		  return deferred.promise;
	  }
	  
	  var apiWrapper = function(path,method,params){
		  var deferred = $q.defer();
		  FB.api(path,method,params, function(response){
			  if (!response || response.error) {
				  deferred.reject(response);
			  }else{
				  deferred.resolve(response);
			  }
		  }); 
		  return deferred.promise;
	  }
	  
	  var api = function(path, method, params){
		  var deferred = $q.defer();
		  
		  if(typeof(method) === "undefined"){
			  method: API_METHOD.GET;
		  }
		  
		  if(typeof(params) === "undefined"){
			  params = {};
		  }
		  
		  if(currentUserAuthResponse != null){
			  deferred.promise = apiWrapper(path, method, params).then(function(response){
				  deferred.resolve(response);
			  }, function(err){
				  deferred.reject(err);
			  });
		  }else{
			  deferred.promise = checkLoginStatus().then( 
					  function(resp){
						  apiWrapper(path, method, params).then(function(response){
							  var res = $q.defer();
							  res.resolve(response);
							  return res.promise;
						  }, function(err){
							  deferred.reject(err);
						  });
					  },
					  function(err){
						  deferred.reject(err);
					  }
			  );
		  }
		 return deferred.promise;
	  }
	  
	  
	  var checkLoginStatus = function(){
		  var deferred = $q.defer();
		  
		  FB.getLoginStatus( function (response){
			  if (response.status === 'connected') {
				  currentUserAuthResponse = response.authResponse;
				  deferred.resolve(currentUserAuthResponse);
			  } else {
				  deferred.promise = doLogin().then(function(res){
					  deferred.resolve(currentUserAuthResponse);
				  }, function(err){
					  deferred.reject(err);
				  })
			  } 
		  });
		  
		  return deferred.promise;
	  }
	  
	  var doLogin = function(){
		  var deferred = $q.defer();
		  FB.login(
				function(response){
					if(response.authResponse){
						currentUserAuthResponse = response.authResponse;
						deferred.resolve(true);
					}else{
						deferred.reject("Not authorized!");
					}
				},
				{
				   scope: settings.permissions
				}
			);
		  return deferred.promise;
	  }
	  
	  return {
		  API_METHOD: API_METHOD,
		  api: api,
		  checkLoginStatus: checkLoginStatus,
		  getUser: getUser,
		  init : init
	  }
  });
