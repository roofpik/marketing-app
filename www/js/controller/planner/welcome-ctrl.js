app.controller("welCtrl", function($scope, $state) {

    $scope.adminId = $state.params.adminId;
    console.log($scope.adminId);
    $scope.goToTasks = function() {
        $state.go('tasks', {
            adminId: $scope.adminId
        });
    }

});
