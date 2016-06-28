app.config(function($stateProvider, $urlRouterProvider) {

  

   //State for login
   $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/auth/login.html',
      controller: 'LoginCtrl'
   });

   $stateProvider.state('resetPassword', {
      url: '/resetPassword',
      templateUrl: 'templates/auth/forgot-password.html',
      controller: 'resetPasswordCtrl'
   });

   $stateProvider.state("home", {
      url: '/home',
      templateUrl: 'templates/home/home.html',
      controller: 'HomeCtrl',
      resolve: {
         currentAuth: function(AuthenticationService){
            return AuthenticationService.checkAuthentication();
         }
      }
   });

   // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/login');
});
