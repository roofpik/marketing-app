app.controller("resetPasswordCtrl", function($scope, $state, $timeout) {
    $scope.email = {};
    $scope.submitEmail = function(form) {

        var auth = firebase.auth();
        //   var emailAddress = $scope.email_reset;

        auth.sendPasswordResetEmail($scope.email.reset).then(function() {
            $timeout(function() {
                $state.go('login');
            }, 0);
        }, function(error) {

        });
    }

    $scope.login = function() {
        $state.go('login');
    }
});
