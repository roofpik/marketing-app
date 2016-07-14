app.controller("LoginCtrl", function($scope, $state, $http, AuthenticationService, $ionicPopup, $ionicLoading, $location) {
    
    // If user already login previously
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          // User is signed in.
          $state.go('welcome');
        } else {
          // No user is signed in.
          console.log("not login");
        }

    });

    // @param (form object)
    $scope.Login = function(user) {
        $ionicLoading.show({
            template: 'Loading...'
        });

        AuthenticationService.LoginEmail(user.email, user.password)
        .then(function(user){ // returns current user

            console.log(user.uid);
            console.log(user.email);
            console.log(user.displayName);

            $ionicLoading.hide();
            $state.go('welcome');
        }, function(error){
            console.log(error);
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Login failed!',
                template: error.message
            })
        });
    }

    $scope.resetPassword = function() {

        $state.go('resetPassword');
    }
});
