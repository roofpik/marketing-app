app.controller("welCtrl", function($scope, $state) {
    $scope.name = localStorage.getItem("name");
    console.log($scope.name);
    $scope.adminId = $state.params.adminId;
    console.log($scope.adminId);
    $scope.goToTasks = function() {
        $state.go('tasks');
    }

});
