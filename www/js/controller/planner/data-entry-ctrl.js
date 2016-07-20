app.controller('DataEntryCtrl', ['$scope', '$state', '$stateParams', '$filter', '$ionicLoading', '$ionicPopup', '$timeout', '$cordovaGeolocation', function($scope, $state, $stateParams, $filter, $ionicLoading, $ionicPopup, $timeout, $cordovaGeolocation){
  // localStorage.removeItem('dataEntryStarted');
  $scope.activityId = $stateParams.activityId;
  console.log($scope.activityId);
  var userId =  localStorage.getItem('uid');
  console.log(userId);
  $scope.showDataEntryButton = true;
  var hasdataEntryInfo = checkLocalStorage('dataEntryStarted');
  if(hasdataEntryInfo){
    console.log(localStorage.getItem('dataEntryStarted'));
    if(localStorage.getItem('dataEntryStarted') == 'started'){
      $scope.showDataEntryButton = false;
    } 
  } else {
    $scope.showDataEntryButton = true;
  }

  var date=new Date();
  date = $filter('date')(date, 'dd-MM-yy');
  console.log(date);
  $ionicLoading.show({
    template: 'Loading...'
  }); 

  getCurrentLocation = function() {
    var posOptions = {
      timeout: 10000,
      enableHighAccuracy: false
    };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function(position) {
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
        console.log($scope.latitude);
        console.log($scope.longitude);
        $ionicLoading.hide();
    });
  }

  getActivityDetails  = function() {
    firebase.database().ref('activity/' + userId + '/'+date+'/' + $scope.activityId).on('value', function(snapshot) {
      console.log(snapshot.val());
      $scope.activityDetails = snapshot.val();
      $scope.activityDetails.planning.start.time = moment($scope.activityDetails.planning.start.time).format('H:mm');
      $scope.activityDetails.planning.end.time = moment($scope.activityDetails.planning.end.time).format('H:mm');
      if($scope.activityDetails.summary){
        console.log('summary Exists')
        if($scope.activityDetails.summary.status != 'cancelled'){
          console.log('not cancelled');
          getCurrentLocation();
        } else {
          console.log('Cancelled');
        }
      } else {
        console.log('not exist');
        getCurrentLocation();
      }
    });
  }
  getActivityDetails();

  $scope.goBack = function(){
    localStorage.removeItem('dataEntryStarted');
    localStorage.getItem('dataEntryStarted');
    $state.go('tasks', {adminId: userId});
  }

  $scope.type=[
    {id: 0, value: true},
    {id: 1, value: false},
    {id: 2, value: false}
  ];

  $scope.showDetails = function(index){
    console.log(index);
    if(index == 1){
      if($scope.activityDetails.planning.active){
        console.log("activity not started");
        $ionicPopup.alert({
          title: 'Start Activity',
          template: 'Please start to fill the summary'
        })
      } else {
        for(var i = 0; i < 3; i++){
          if(i == index){
            $scope.type[i].value = true;
          } else {
            $scope.type[i].value = false;
          }
        } 
      }
    } else {
      for(var i = 0; i < 3; i++){
        if(i == index){
          $scope.type[i].value = true;
        } else {
          $scope.type[i].value = false;
        }
      }     
    }
  }

  $scope.startActivity = function(){
    $scope.activityDetails.planning.active = false;
    $scope.start = {
      latitude: $scope.latitude,
      longitude: $scope.longitude,
      time: new Date().getTime()
    }
    var startThisActivity = {};
    startThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/planning/active'] = $scope.activityDetails.planning.active;
    startThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/summary/status'] = 'started';
    startThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/summary/start'] = $scope.start;
    console.log(startThisActivity);
    db.ref().update(startThisActivity);
    $scope.type[0].value = false;
    $scope.type[1].value = true;
    $scope.type[2].value = false;
  }

  $scope.cancel = {
    reason: ''
  }

  $scope.cancelActivity = function(){
    var myPopup = $ionicPopup.show({
     template: '<input type="text" ng-model="cancel.reason">',
     title: 'Are you sure you want to cancel?',
     subTitle: 'Please specify the reason below',
     scope: $scope,
     buttons: [
       { text: 'Exit',
         type: 'button-stable'},
       {
         text: '<b>Cancel</b>',
         type: 'button-assertive',
         onTap: function(e) {
           if (!$scope.cancel.reason) {
             e.preventDefault();
           } else {
             return $scope.cancel.reason;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
    console.log('Tapped!', res);
    $scope.activityDetails ={
      summary:{
        cancellationRemark:{
          comment: $scope.cancel.reason,
          latitude: $scope.latitude,
          longitude: $scope.longitude,
          time: new Date().getTime()
        }
      }
    }
    console.log($scope.activityDetails.summary);
    var cancelThisActivity = {};
    cancelThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/planning/active'] = false;
    cancelThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/summary/cancellationRemark'] = $scope.activityDetails.summary.cancellationRemark;
    cancelThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/summary/status'] = 'cancelled';
    console.log(cancelThisActivity);
    db.ref().update(cancelThisActivity);
   });
  }

  $scope.newComment = {
    comment:''
  };

  $scope.addComment = function(){
    if($scope.newComment.comment.length > 0){
      $scope.newComment.name = localStorage.getItem("name");
      $scope.newComment.time = new Date().getTime();
      $scope.newComment.userId = userId;
      var newCommentKey = db.ref("activity/"+userId + '/'+date+'/' + $scope.activityId+'/comments').push().key;
      var comment = {};
      comment["activity/"+userId + '/'+date+'/' + $scope.activityId+'/comments/'+newCommentKey] = $scope.newComment;
      db.ref().update(comment).then(function(){
        $scope.newComment = {};
        $ionicPopup.alert({
          title:'Comment Added',
          template:'Thanks for adding your comments'
        });
      });
    } else {
      $ionicPopup.alert({
        title:'Blank Comment',
        template:'Please write a comment before saving'
      });
    }
  }


  $scope.startDataEntry = function(){
    localStorage.setItem('dataEntryStarted', 'started');
    console.log(localStorage.getItem('dataEntryStarted'));
    getProjectEditable($scope.activityDetails.planning.projectId, $scope.activityDetails.planning.cityId);
  }

  function getProjectEditable(projectid, cityid) {
    console.log($scope.activityDetails.planning.projectType+'Versions/'+cityid+'/projects/'+projectid);
    var projectRequiredDetail = {};
    var newData = firebase.database().ref($scope.activityDetails.planning.projectType+'Versions/'+cityid+'/projects/'+projectid+'/editable');
      newData.on('value', function(data) {
        console.log(data.val().version);
        //$scope.editableVersion = data.val().version;
        projectRequiredDetail.version = data.val().version;
        projectRequiredDetail.projectId = projectid;
        projectRequiredDetail.cityId = cityid;
        projectRequiredDetail.activityId = $scope.activityId;
        projectRequiredDetail.projectType = $scope.activityDetails.planning.projectType;
        // window.localStorage['projectRequiredDetail'] = JSON.stringify(projectRequiredDetail);
        // console.log(window.localStorage['projectRequiredDetail']);
        localStorage.setItem('projectRequiredDetail', JSON.stringify(projectRequiredDetail));
        console.log(localStorage.getItem('projectRequiredDetail'));
        console.log(projectRequiredDetail);
        $state.go('all-forms');
      });
    };

    $scope.endWithRemark = {
      remark:''
    };

    $scope.endActivity = function(){
      console.log($scope.endWithRemark.remark);
      // console.log('end called');
      $scope.end = {
        latitude: $scope.latitude,
        longitude: $scope.longitude,
        time: new Date().getTime()
      }

      var endThisActivity = {};
      if($scope.remark != ''){
        endThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/summary/remark'] = $scope.endWithRemark.remark;
      }
      endThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/summary/status'] = 'completed';
      endThisActivity["activity/"+userId + '/'+date+'/' + $scope.activityId+'/summary/end'] = $scope.end;
      db.ref().update(endThisActivity);
    }

}]);

function checkLocalStorage(item){
   if (localStorage.getItem(item) === null ||  typeof localStorage.getItem(item) === 'undefined') {
      return false
    }
    else{
      return true
    }
}