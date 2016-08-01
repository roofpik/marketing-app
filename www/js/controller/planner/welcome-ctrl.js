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

    getData();

    $scope.names = [];

    function getData(){
        console.log('called');
            db.ref("protectedResidential/-KN7HFa3un2SPyrUKosy/projects").once('value', function(snapshot){
        console.log(snapshot.val());
        angular.forEach(snapshot.val(), function(value, key){
            console.log(value['1-1'].projectName);
            $scope.names.push(value['1-1'].projectName);
        })

        $scope.names = $scope.names.sort();
        console.log($scope.names);
    })  
    }



});
