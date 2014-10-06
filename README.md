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

##


License
===============================
This project is released over [MIT license](http://opensource.org/licenses/MIT "MIT License")

Author
===============================
[Lorenzo Bertacchi](http://www.lorenzobertacchi.it/)
