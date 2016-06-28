app.controller("HomeCtrl", function($scope, AuthenticationService, $state){
   $scope.logout = function(){
   	AuthenticationService.Logout();
   	$state.go('login');
   }
   
})
