app.controller("phoneCallsCtrl", function($scope, $state, $timeout,$filter, $cordovaGeolocation,  $ionicPopup,$ionicLoading) {
    $scope.activityId = $state.params.activityId; 
    console.log( $scope.activityId);
    var userid =  localStorage.getItem("uid");
    console.log(userid);

    $scope.date=new Date();
    var dates = $filter('date')($scope.date, 'dd-MM-yy');

    function getActivitydetails() {
           $ionicLoading.show({
      template: 'Loading...'
    }); 
       
        firebase.database().ref('/activity/' + userid + '/'+dates+'/' + $scope.activityId).on('value', function(snapshot) {
            $scope.actDetails = snapshot.val();
            console.log($scope.actDetails);
             $scope.planningDetails = $scope.actDetails.planning;
             $scope.comments=$scope.actDetails.comments;
           
        });
    };
     $timeout(function(){
                checkIfActivityStarted();
             },5000);

    getActivitydetails();

    function checkIfActivityStarted() { 
        console.log("check");
        //in execution
         $ionicLoading.hide();
        if($scope.actDetails.planning.active == true) {
            $scope.toggle = "Start Activity";
           
        } else {
             
            if ($scope.actDetails.summary.status == "started")
                $scope.toggle = "End Activity";
            else if ($scope.actDetails.summary.status == "completed")
                $scope.toggle = "Completed";
            else if ($scope.actDetails.summary.status == "cancelled")
                $scope.toggle = "Cancelled";
        }
    };

    $scope.startActivity = function(foo) {

        console.log("clicked");
       
         if ($scope.actDetails.planning.active ==true) {
            upd = {};
            upd['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/planning/active'] = false;
            firebase.database().ref().update(upd);
        }
     
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                $scope.time = position.timestamp;  
                      executionComp = {
                                "time": $scope.time

                            };   

                 if ($scope.toggle == "Start Activity") {
                            
                 
                            $scope.startTime = $scope.time;
                            console.log(executionComp);
                            
                            updates = {};
                            updates['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/start'] = "executionComp";
                            updates['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/status'] = "started";
                            firebase.database().ref().update(updates);
                                              
                            $scope.toggle = "End Activity";

                            $ionicPopup.alert({
                           title: "Activity started !!",
                           template: 'Fill the summary now :)'
                         });                        
                           
                } else if ($scope.toggle == "End Activity") {
                        
                            $scope.endTime = $scope.time;
                          
                            updates = {};
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/end'] = executionComp;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/status'] = "completed";
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/remark'] = foo.remark;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/contact_person'] = foo.contact_person;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/contact_number'] = foo.phone_no;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/designation'] = foo.designation;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/department'] = foo.department;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/purpose'] = foo.purpose;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/project_id'] = foo.project_id;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/project_name'] = foo.project_name;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/details'] = foo.details;
                            updates['/activity/' + userid + '/' + dates + '/' + $scope.activityId + '/summary/callstatus'] = foo.call_status;
                            

                          
                            firebase.database().ref().update(updates);
                            $scope.toggle = "Completed";
                             $ionicPopup.alert({
                               title: "Activity completed !!",
                               template: 'Go to another activity now :)'
                             });

                 } else if ($scope.toggle == "Completed") {

                            $ionicPopup.alert({
                           title: "Already completed !!",
                           template: 'You can now start next activity :)'
                         });
                 } 

        }, function(err) {

            });    

    };

    $scope.cancel = function() {
        if($scope.actDetails.summary.status=="")
        {
            upd = {};
            upd['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/status'] = "cancelled";
            firebase.database().ref().update(upd);
            alert(" cancelled !!");
        }
        else {
            alert("cannot cancel !!");
        } 
   
    };

    $scope.add_comment = function(com) {
        console.log("adding comment");
        up = {};
        console.log(com);
        com.userid = userid;
        com.name = localStorage.getItem("name");
        com.time = new Date();
        var newkey=firebase.database().ref('/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/comments').push().key;
        up['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/comments/' + newkey] = com;
        firebase.database().ref().update(up);


    };

});