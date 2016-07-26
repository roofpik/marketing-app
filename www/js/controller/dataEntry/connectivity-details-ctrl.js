app.controller('ConnectivityDetailsCtrl',['$scope', '$timeout', '$state', '$ionicPopover','$ionicPopup', '$ionicLoading', function($scope, $timeout, $state, $ionicPopover, $ionicPopup, $ionicLoading){
	$ionicLoading.show({
	    template: 'Loading...'
	  }); 
	$scope.formName = 'connectivity-details';
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;

	$scope.connectivity = {
		autoStand: {},
		cabStand: {}
	};

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/connectivity').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.connectivity = snapshot.val();
            	console.log($scope.connectivity);
            }
            $ionicLoading.hide(); 
         });
    };

    $scope.selectStand = function(value){
    	console.log(value);
    	$scope.connectivity[value][value] = !$scope.connectivity[value][value];
    	console.log($scope.connectivity[value][value]);
    	if(!$scope.connectivity[value][value]){
    		delete $scope.connectivity[value];
    	}
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
        $state.go('all-forms');
    }

	$scope.save = function(){
		console.log($scope.connectivity);
		$ionicLoading.show({
		    template: 'Loading...'
		  }); 
		var addProjectDetails = {};
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/"+ $scope.projectId+'/'+$scope.editableVersion+ "/connectivity"] = $scope.connectivity;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails).then(function(){
      		$ionicLoading.hide();
	      		$ionicPopup.alert({
				title: 'Successful',
				template: 'Project Details updates successfully'
			}).then(function(){
				$scope.connectivity = {};
				$state.go('data-entry', {activityId:projectRequiredDetail.activityId});
			})
      	});
	}

}]);