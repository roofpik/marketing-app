app.controller("LoginCtrl", ['$scope', '$http', 'AuthenticationService', function($scope, $http, AuthenticationService){
   $scope.newUser = {
      userEmail: '',
      userPassword: ''
   };
   $scope.Login = function(form){

      console.log($scope.newUser.userEmail, $scope.newUser.userPassword);
      AuthenticationService.LoginEmail($scope.newUser.userEmail, $scope.newUser.userPassword, function(result){
         console.log(result);
         if(result === true){
            console.log(result);
            // $location.path("/dashboard");
         }
         else{
            console.log("result = false, error in login");
         }
      });
   }
   AuthenticationService.Logout();
}]);
