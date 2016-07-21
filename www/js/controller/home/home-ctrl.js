app.controller("HomeCtrl", function($scope, AuthenticationService, $state){
   $scope.logout = function(){
   	localStorage.clear();
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
   	AuthenticationService.Logout();
   	$state.go('login');
   };

   $scope.addProject = function(){
   	$state.go('create-project');
   }
   
})
