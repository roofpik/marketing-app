app.controller("resetPasswordCtrl", function($scope, $state, $ionicLoading, $ionicPopup) {
    
    $scope.submitEmail = function(email) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var auth = firebase.auth();

        auth.sendPasswordResetEmail(email).then(function() {

            $ionicLoading.hide();
            $ionicPopup.alert({
                 title: 'Reset Password',
                 template: 'Your password reset link has been sent to '+email
           }).then(function(res) {
                $state.go('login');
           });

        }, function(error) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                 title: 'Invalid email',
                 template: 'Please enter a valid email address.'
           })
        });
    }
    $scope.login = function() {
        $state.go('login');
    }
});
