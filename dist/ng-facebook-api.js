/**
 * @Author: Lorenzo Bertacchi (www.lorenzobertacchi.it)
 */

'use strict';

var module = angular.module('ng-facebook-api', []);


module.provider('facebook',function (){
	var config = {};
	var sdkLang = "en_US"
	var permissions = [];
	this.setInitParams = function(appId,status,xfbml,cookie,apiVersion, sdkLangParam){
		config = {
			appId      : appId,
			status     : status,
			xfbml      : xfbml,
			cookie     : cookie,
			version    : apiVersion
		};
		sdkLang=sdkLangParam || sdkLang;
		/*if(typeof sdkLang !== "undefined"){
		 sdkLang = sdkLangParam;
		 }*/
	}


	this.setAppId = function(appId){
		config.appId = appId;
	}

	this.setApiVersion = function(apiVersion){
		config.version = apiVersion;
	}

	this.setCookie = function(cookie){
		config.cookie = cookie;
	}



	var sdkInit = function($rootScope,$timeout){
		(function (d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/"+sdkLang+"/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
		if(typeof window.FB == 'undefined'){
			window.fbAsyncInit = function() {
				window.FB.init(config);
				$rootScope.$broadcast("fb.init", window.FB);
			};
		}else{

			$timeout(function(){
				window.FB.init(config);
				$rootScope.$broadcast("fb.init", window.FB);
			},0)
		}
	}

	this.setPermissions = function(perms){
		permissions = perms;
	}

	this.$get = ["FacebookService","$rootScope","$timeout",function(FacebookService, $rootScope,$timeout){

		sdkInit($rootScope,$timeout);

		FacebookService.setPermissions(permissions);

		var providerFunc = {
			getConfig : function(){
				return config;
			}
		};
		angular.extend(providerFunc,FacebookService);
		return providerFunc;

	}]

});

module.service('FacebookService',["$q", function ($q) {

	var settings = {};
	var currentUserAuthResponse = null;
	var API_METHOD = {GET: "get", POST: "post", DELETE: "delete"}
	var PICTURE_TYPE = {SQUARE: "square", SMALL:"small", NORMAL: "normal", LARGE: "large"}

	var setPermissions = function(permissions){
		settings.permissions = permissions;
	}


	var getUser = function(id, fields){
		var deferred = $q.defer();

		var request = "/me/";

		if(angular.isDefined(id) && id != null){
			request = "/"+id+"/"
		}

		if(!angular.isDefined(fields) && fields == null){
			fields = {};
		}
		api(request,API_METHOD.GET,fields).then(function(response){
			deferred.resolve({user:response,authResponse: currentUserAuthResponse});
		},function(err){
			deferred.reject(err);
		});

		return deferred.promise;
	}

	var getUserPicture = function(id,fields){
		var deferred = $q.defer();
		var userId = angular.isUndefined(id) ? "me": id;
		var fieldsDef = {
			redirect: false,
			height: "200",
			type: PICTURE_TYPE.NORMAL,
			width: "200"
		}

		angular.extend(fieldsDef,fields);

		api('/'+userId+'/picture',API_METHOD.GET,fieldsDef).then(function(response){
			deferred.resolve({picture:response.data,authResponse: currentUserAuthResponse});
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
			deferred.promise = apiWrapper(path, method, params);

		}else{
			deferred.promise = checkLoginStatus().then(
				function(resp){
					return apiWrapper(path, method, params);
				},
				function(err){
					var r = $q.defer();
					r.reject(err);
					return r.promise;
				}
			);
		}
		return deferred.promise;
	}


	var checkLoginStatus = function( forcelogin ){
		var deferred = $q.defer();
		var forcelogin = (typeof forcelogin == "undefined" || forcelogin == null)?true:forcelogin;

		FB.getLoginStatus( function (response){
			if (response.status === 'connected') {
				currentUserAuthResponse = response.authResponse;
				deferred.resolve(currentUserAuthResponse);
			} else {
				if(forcelogin) deferred.promise = doLogin();
				else deferred.reject(null); //Better {response:null,reason:"Not logged in"}
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
					deferred.resolve(currentUserAuthResponse);
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

	var doLogout = function(){
		var deferred = $q.defer();
		FB.logout(function(response) {
			if (!response || response.error) {
				deferred.reject(response);
			}else{
				deferred.resolve(response);
			}
		});
		currentUserAuthResponse = null;
		return deferred.promise;
	}

	return {
		API_METHOD: API_METHOD,
		PICTURE_TYPE: PICTURE_TYPE,
		api: api,
		checkLoginStatus: checkLoginStatus,
		getUser: getUser,
		getUserPicture: getUserPicture,
		login:doLogin,
		logout: doLogout,
		setPermissions : setPermissions
	}
}]);


