app.controller("DataEntryCtrl", function($scope, $state, $timeout,$filter, $cordovaGeolocation, $ionicPopup, $timeout) {
    $scope.activityId = $state.params.activityId; 
    console.log( $scope.activityId);
    var userid =  localStorage.getItem('uid');
    console.log(userid);
    console.log(new Date());
    localStorage.removeItem('projectRequiredDetail');
    $scope.activity = {};

    $scope.date=new Date();
    var dates = $filter('date')($scope.date, 'dd-MM-yy');

    function getActivitydetails() {  
        firebase.database().ref('/activity/' + userid + '/'+dates+'/' + $scope.activityId).on('value', function(snapshot) {
            $scope.actDetails = snapshot.val();
            console.log($scope.actDetails);
             $scope.planningDetails = $scope.actDetails.planning;
             console.log($scope.planningDetails.cityId);
             $scope.comments=$scope.actDetails.comments;
             $timeout(function(){
                checkIfActivityStarted();
             },100);
        });
    };

    getActivitydetails();

    function checkIfActivityStarted() { 
        console.log("check");
        //in execution
        if($scope.actDetails.planning.active == true) {
            console.log($scope.actDetails.planning.active);
            $scope.toggle = "Start Activity";
           
        } else {
            console.log("not correct");   
            // if ($scope.actDetails.summary.status == "started")
            //     $scope.toggle = "End Activity";
            // else if ($scope.actDetails.summary.status == "completed")
            //     $scope.toggle = "Completed";
            // else if ($scope.actDetails.summary.status == "cancelled")
            //     $scope.toggle = "Cancelled";
        }
    };

    $scope.data_entry=function(){
        console.log();
        $state.go('all-forms', {projectId:$scope.planningDetails.projectId , cityId: $scope.planningDetails.cityId})
        // $state.go('project-basic-details');
    };

    function getProjectEditable(cityId, projectId) {
        console.log(cityId, projectId);
        var version;
        // console.log('protectedResidentialVersions/'+$scope.cityId+'/projects/'+$scope.projectId);
        var newData = firebase.database().ref('protectedResidentialVersions/'+cityId+'/projects/'+projectId+'/editable');
        newData.on('value', function(data) {
            console.log(data.val().version);
            version = data.val().version;
            var projectRequiredDetail = {};
            projectRequiredDetail.version = version;
            projectRequiredDetail.projectId = projectId;
            projectRequiredDetail.cityId = cityId;
            window.localStorage['projectRequiredDetail'] = JSON.stringify(projectRequiredDetail);
            console.log(window.localStorage['projectRequiredDetail']);
            $state.go('project-basic-details');
        });
    };

    $scope.startActivity = function() {
        console.log($scope.activity);
        console.log("clicked");
       
         if ($scope.actDetails.planning.active ==true) {
            //update the planning active false
            //update the summary active true
            upd = {};
           
            upd['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/planning/active'] = "false";
            console.log("saved as false");
        
            firebase.database().ref().update(upd);
        }

        
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                $scope.time = position.timestamp;
                console.log($scope.time);

                console.log($scope.latitude);
                console.log($scope.longitude);
                console.log($scope.time);
                executionComp = {
                    "lat": $scope.latitude,
                    "lng": $scope.longitude,
                    "time": $scope.time
                };

         if ($scope.toggle == "Start Activity") {

                     $ionicPopup.alert({
                   title: "Activity started !!",
                   template: 'Fill the summary now :)'
                 });

                    //send lat ,lang n time
                    $scope.startTime = $scope.time;

                    // var a = new Date($scope.time * 1000);
                    // var hour = a.getHours();
                    // var min = a.getMinutes();
                    // var sec = a.getSeconds();
                    // var time = hour + ':' + min + ':' + sec ;
  
                    // console.log(time);

//                     var date = new Date($scope.startTime*1000);
// // Hours part from the timestamp
//                     var hours = date.getHours();
//                     // Minutes part from the timestamp
//                     var minutes = "0" + date.getMinutes();
//                     // Seconds part from the timestamp
//                     var seconds = "0" + date.getSeconds();
//                     console.log(hours+':'+minutes+':'+seconds);
//                     // Will display time in 10:30:23 format
//                     var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
//                     console.log(formattedTime);

  

                    console.log(executionComp);
                    updates = {};
                    updates['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/start'] = executionComp;
                    updates['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/status'] = "started";
                    firebase.database().ref().update(updates);
                                      
                    $scope.toggle = "End Activity";
                
                   
        } else if ($scope.toggle == "End Activity") {

                    console.log($scope.activity);
                      $ionicPopup.alert({
                       title: "Activity completed !!",
                       template: 'Go to another activity now :)'
                     });
                    //send lat,long and time
                    console.log(executionComp);
                    $scope.endTime = $scope.time;
                    //console.log(foo.mode);
                    updates = {};
                    updates['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/end'] = executionComp;
                    updates['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/status'] = "completed";
                    // updates['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/data'] = foo.data;
                    updates['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/summary/remark'] = $scope.activity.remark;
                    firebase.database().ref().update(updates);
                    $scope.toggle = "Completed";

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
        com.name = localStorage.getItem("username");
        com.time = new Date();
        var newkey=firebase.database().ref('/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/comments').push().key;
        up['/activity/' + userid + '/'+dates+'/' + $scope.activityId + '/comments/' + newkey] = com;
        firebase.database().ref().update(up);


    };

});