app.controller("tasksCtrl", function($ionicHistory, $scope, $state, $http,  $filter, $timeout,$ionicLoading,$timeout) {

    $scope.userid = localStorage.getItem("uid");
    console.log($scope.userid);
    $scope.date = new Date();
    var dates = $filter('date')($scope.date, 'dd-MM-yy');

    $scope.activities = [];

    function getActivities() {
          $ionicLoading.show({
              template: 'Loading...'
            }).then(function(){
               console.log("The loading indicator is now displayed");
            });
        var ref = firebase.database().ref('/activity/' + $scope.userid + '/' + dates);
        ref.once('value', function(snapshot){
            $ionicLoading.hide();
            $timeout(function() {
                console.log(snapshot.val());
                angular.forEach(snapshot.val(), function(value,key){
                    value.id = key;
                    $scope.activities.push(value);
                    console.log(value);
                  
                    if(value.planning.active=="false"||value.planning.active==false)
                    {
                        if(value.summary.status=="completed")
                        {
                             var updates = {};
                             // console.log('/activity/' + $scope.userid  + '/' + dates + '/' +key+'/checked');
                            updates['/activity/' + $scope.userid  + '/' + dates + '/' +key+'/checked'] =true ;

                            firebase.database().ref().update(updates);
                        }
                    }
                });


            }, 10);
           
            
        });
    };

    getActivities();
 
    $scope.goToActivityDetails = function(x, y) {
        //x is activity's type
        //y is activity's id
        console.log(x);
        console.log(y);
      
        if (x == "Appoitment")
            $state.go('appointment', {
                activityId: y
            });
        else if (x == "Local Travel")
            $state.go('travel-local', {
                activityId: y
            });

        else if (x == "Outstation Travel")
            $state.go('travel-outstation', {
                activityId: y
            });
        else if (x == "Phone Calls")
            $state.go('phone-calls', {
                activityId: y
            });
        else if (x == 'Email')
            $state.go('email-p', { 
                activityId: y
            });
        
        else if (x == "Online Research")
              $state.go('online-research', {
                activityId: y
            });
        
        else if (x == "Leave")
            $state.go('leave', {
                activityId: y
            });
        else if (x == 'Data Entry')
            $state.go('data-entry', {activityId: y});
        else if (x == 9)
            $state.go('Meeting', {
                activityId: y
            });
        else if (x == 10)
            $state.go('Training', {
                activityId: y
            });
        else if (x == 11)
            $state.go('Planning', {
                activityId: y
            });
        else if (x == 12)
            $state.go('Break', {
                activityId: y
            });
        else if (x == 13)
            $state.go('Others', {
                activityId: y
            });
        else if (x == 14) //end day
            $state.go('timeline1', {
            activityId: y
            });
        else
            console.log("Default");
    };

    $scope.myGoBack = function() {
        $state.go('welcome');
      };
});