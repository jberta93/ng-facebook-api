'use strict';

angular
  .module('exampleApp',['ng-facebook-api']).config(function( facebookProvider) {
	  facebookProvider.setInitParams('650566625058432',true,true,true,'v2.1');
	  facebookProvider.setPermissions(['email','read_stream']);
  });
