app.controller("LoginCtrl", function($scope, $state, $http, AuthenticationService) {
    
    $scope.newUser = {
        userEmail: '',
        userPassword: ''
    };


    var m_names = new Array("Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec");

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    $scope.today = curr_date + "-" + m_names[curr_month] + "-" + curr_year;

    $scope.Login = function(form) {

        //   console.log($scope.newUser.userEmail, $scope.newUser.userPassword);
        AuthenticationService.LoginEmail($scope.newUser.userEmail, $scope.newUser.userPassword, function(result) {
            // console.log(result);
            if (result === true) {
                //  console.log(result);
                // $location.path("/dashboard");
                $scope.newUser.userPassword = '';
                $state.go('dashboard');
            } else {
                //  console.log("result = false, error in login");
            }
        });
    }

    $scope.resetPassword = function() {

        $state.go('resetPassword');
    }
    AuthenticationService.Logout();
});
