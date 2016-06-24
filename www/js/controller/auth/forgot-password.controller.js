app.controller("forgotPasswordCtrl", ['$scope', '$http', '$timeout', function($scope, $http, $timeout){
   $scope.submitEmail = function(form) {
      $scope.notouchreset = true;
      if(form.$invalid){
         return ;
      }
      var auth = firebase.auth();
      var emailAddress = $scope.email_reset;
      auth.sendPasswordResetEmail(emailAddress).then(function() {
         console.log("email sent");
         $timeout(function(){
            $location.path('/login');
         }, 0);
      }, function(error) {
         console.log(error);
      });
   }
}]);
