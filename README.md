Welcome to the ng-facebook-api
===============================

Facebook API wrapper for AngularJS, you don't need to be worried of the configuration of Facebook JS SDK, you have only to code using API.

Ready and easy to use.

The module is now under developing, in the next weeks the module will be completed and we're going to put online the official docs.

##Configuration

1. Download the library [clicking here](https://github.com/jberta93/ng-facebook-api/archive/master.zip)
2. Include [Facebook JS SDK](https://developers.facebook.com/docs/javascript/quickstart/v2.1), only the SDK not the initialization `window.fbAsyncInit` and `FB.init`
3. Modify your application inject the `ng-facebook-api`
4. In your application config, setup the facebookProvider with your Facebook App settings. The settings are used in [FB.init](https://developers.facebook.com/docs/javascript/reference/FB.init/)
5. If your app use extra permissions that required user approval set in your config. You can set permissions also in the controller, obviously before using login.

Here an example of configuration:
```javascript
angular
  .module('<your-app-name>',['ng-facebook-api'])
     .config(function( facebookProvider) {
        /**
        * Here the list of params used to configure the provider
        * @param appId
        * @param status
        * @param xfbml
        * @param cookie
        * @param api-version
        */
	 facebookProvider.setInitParams('your-fb-app-id',true,true,true,'v2.1');
	 //if your app use extra permissions set it
	 facebookProvider.setPermissions(['email','read_stream']);
      });
```


**Important:** You must include the JS SDK in your `<head>` or in method `.run(function(){})` of angular app.

##Usage

The provider permits to have an easy access to the most used api (like user info retriving, avatar, etc..) but also permits, thanks to `api` method, to used all methods of [Graph API](https://developers.facebook.com/docs/graph-api/reference/).

Every methods check the login status and if user isn't logged, launch the login procedure. Anyway the provider has public methods `login` and `checkLoginStatus` to implement your custom flows. 

### Check SDK Loading

In your controller listen on the `$rootScope` the event `fb.init`

```javascript
module.controller('MainCtrl', function ($rootScope,$scope, facebook) {
	$rootScope.$on("fb.init",function(){
	    console.log("SDK Ready");
	});
});
```

### Run the method

Run the method that you need. For instance getUser to get user available information.

```javascript
module.controller('MainCtrl', function ($rootScope,$scope, facebook) {
	$rootScope.$on("fb.init",function(){
	    console.log("SDK Ready");
	    facebook.getUser().then(function(r){
	    	console.log(r.user); //User data returned;
	    	console.log(r.authResponse); //Token auth, id etc..
	    }, function(err){
	    	console.log("Ops, something went wrong...");
	    });
	    
	});
});
```




License
===============================
This project is released over [MIT license](http://opensource.org/licenses/MIT "MIT License")

Author
===============================
[Lorenzo Bertacchi](http://www.lorenzobertacchi.it/)
