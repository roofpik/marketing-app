app.controller("welCtrl", function($scope, $state, AuthenticationService) {
    $scope.name = localStorage.getItem("name");

    var d = new Date();
    $scope.date = d.toDateString();
    
    $scope.goToTasks = function() {
        $state.go('tasks');
    }

    $scope.addProjects = function() {
        $state.go('create-project');
    }

    $scope.addTask = function() {
        $state.go('add-task');
    }

    $scope.logout = function(){
        console.log("called");
        AuthenticationService.Logout();
        $state.go('login');
    }

});
