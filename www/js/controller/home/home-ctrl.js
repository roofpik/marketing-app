app.controller("HomeCtrl", function($scope, AuthenticationService, $state){
   $scope.logout = function(){
   	AuthenticationService.Logout();
   	$state.go('login');
   };

   $scope.addProject = function(){
   	$state.go('create-project');
   }
   
})
