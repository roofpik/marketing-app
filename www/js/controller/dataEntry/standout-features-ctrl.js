app.controller('StandoutFeaturesCtrl', ['$scope', '$ionicPopover', '$state', '$ionicLoading','$firebaseArray', function($scope, $ionicPopover, $state, $ionicLoading, $firebaseArray){
	$ionicLoading.show({
	    template: 'Loading...'
	  });
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
    $scope.projectType = projectRequiredDetail.projectType;

	$scope.formName ='standout-features';
	$scope.hideFeatures = true;

	$scope.standoutFeatures = {};

	getProjectDetails();

    function getProjectDetails(){
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/standoutFeatures');
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/standoutFeatures').on('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.standoutFeatures = {};
            	$scope.standoutFeatures = snapshot.val();
            	console.log($scope.standoutFeatures);
            }
            // $ionicLoading.hide(); 
            getStandoutFeatures();
         });
    };

    function getStandoutFeatures(){
    	console.log('called');
    	var featureRef = db.ref('standoutFeatures');
    	console.log($firebaseArray(featureRef));
    	$scope.availableStandoutFeatures = $firebaseArray(featureRef);
    	$ionicLoading.hide(); 
    }
    $scope.standoutFeatures = {};

    $scope.showStandoutFeatures  = function(){
    	console.log($scope.showStandoutFeature.query);
    	if($scope.showStandoutFeature.query.length > 1){
    		$scope.hideFeatures = false;
    	} else {
    		$scope.hideFeatures = true;
    	}
    }

    $scope.addStandoutFeatures = function(thisStandoutFeatures){
    	console.log(thisStandoutFeatures);
	 	var updates = {};
	    updates[$scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/standoutFeatures/'+thisStandoutFeatures.featureId+'/featureId'] = thisStandoutFeatures.featureId;
	    updates[$scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/standoutFeatures/'+thisStandoutFeatures.featureId+'/featureName'] = thisStandoutFeatures.featureName;
	    console.log(updates);
	    firebase.database().ref().update(updates).then(function(){
	    	$scope.standoutFeatures[thisStandoutFeatures.featureId] = {
	    		featureId: thisStandoutFeatures.featureId,
	    		featureName: thisStandoutFeatures.featureName
	    	}
	    });
    }

    $scope.removeStandoutFeatures = function(thisStandoutFeatures){
    	console.log(thisStandoutFeatures);
    	db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/standoutFeatures/'+thisStandoutFeatures.featureId).remove();
    }

	$ionicPopover.fromTemplateUrl('templates/dataEntry/popover.html', {
	    scope: $scope,
	  }).then(function(popover) {
	    $scope.popover = popover;
	  });

	 $scope.closePopover = function() {
	    $scope.popover.hide();
	  };

	$scope.viewOtherForms = function(page){
		if($scope.formName == page){

		} else {
			$state.go(page);
		}
	}

	$scope.goBack = function(){
        console.log('called');
        $state.go('data-entry', {activityId:projectRequiredDetail.activityId});
    }
}]);