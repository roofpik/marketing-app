app.controller("tasksCtrl", function($scope, $state, $http,  $filter, $timeout) {

    $scope.adminId = $state.params.adminId;
    console.log($scope.adminId);
    $scope.date = new Date();
    var dates = $filter('date')($scope.date, 'dd-MM-yy');

    $scope.activities = [];

    function getActivities() {
        var ref = firebase.database().ref('/activity/' + $scope.adminId + '/' + dates);
        ref.on('value', function(snapshot){
            console.log(snapshot.val());
            angular.forEach(snapshot.val(), function(value,key){
                value.id = key;
                $scope.activities.push(value);
            });
            $timeout(function(){
                console.log($scope.activities);
            }, 50);
        });
    };

    getActivities();
 
    $scope.goToActivityDetails = function(x, y) {
        //x is activity's type
        //y is activity's id
        console.log(x);
        console.log(y);

        if (x == "appoitment")
            $state.go('appointment', {
                activityId: y
            });
        else if (x == "localTravel")
            $state.go('travel_local', {
                activityId: y
            });

        else if (x == "OutstationTravel")
            $state.go('travel_outstation', {
                activityId: y
            });
        else if (x == "phoneCalls")
            $state.go('phone_calls', {
                activityId: y
            });
        else if (x == 'Email')
            $state.go('email', {
                activityId: y
            });
        else if (x == "onlineResearch")
            $state.go('online_research', {
                activityId: y
            });
        else if (x == "leave")
            $state.go('leave', {
                activityId: y
            });
        else if (x == 'DataEntry')
            $state.go('data-entry', {
                activityId: y
            });
        else if (x == 9)
            $state.go('meeting', {
                activityId: y
            });
        else if (x == 10)
            $state.go('training', {
                activityId: y
            });
        else if (x == 11)
            $state.go('planning', {
                activityId: y
            });
        else if (x == 12)
            $state.go('break', {
                activityId: y
            });
        else if (x == 13)
            $state.go('others', {
                activityId: y
            });
        else if (x == 14) //end day
            $state.go('timeline1', {
            activityId: y
        });
    };
});