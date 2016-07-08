app.controller("welCtrl", function($scope, $state) {
    $scope.name = localStorage.getItem("name");
    console.log($scope.name);
    $scope.adminId = $state.params.adminId;
    console.log($scope.adminId);

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

});
