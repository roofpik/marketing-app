app.controller('OtherDetailsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicPopup', '$ionicLoading',function($scope, $timeout, $state,$ionicPopover,$ionicPopup, $ionicLoading){
	$ionicLoading.show({
	    template: 'Loading...'
	  });
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;

	$scope.formName ='other-details';
	$scope.parkSelected = false;

	$scope.other = {};

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/other').once('value', function(snapshot) {
            if(snapshot.val() != null){
            	$scope.other = snapshot.val();
            	if($scope.other.park != undefined){
            		$scope.parkSelected = true;
            	}
            	// if($scope.other.powerBackup != undefined){

            	// }
            	console.log($scope.other);
            }
            $ionicLoading.hide(); 
         });
    };


	$scope.parameters = [
		{id:'waitingLoungeInTower', name:'Waiting Lounge In Tower'},
		{id:'airConditioningInWaitingLounge', name: 'Air Conditioning In Waiting Lounge'},
		{id:'petFriendly', name: 'Pet Friendly'},
		{id:'wheelchairFriendly', name: 'Wheelchair Friendly'},
		// {id:'playSchool', name: 'Play School'},
		// {id:'daycare', name: 'Daycare'},
		{id:'atm', name: 'ATM'},
		// {id:'grocery', name: 'Grocery'},
		// {id:'pharmacy', name: 'Pharmacy'},
		// {id:'parlour', name: 'Parlour'},
		// {id:'laundry', name: 'Laundry'},
		// {id:'bank', name: 'Bank'},
		// {id:'centralWifi', name: 'Central WiFi'},
		// {id:'DTHCabling', name: 'DTH Cabling'},
		// {id:'gasPipelineProvisioned', name: 'Gas Pipeline Provisioned'}
	];

	$scope.powerBackupSelected = '';

	$scope.selectPowerBackup = function(){
		$scope.powerBackupSelected = !$scope.powerBackupSelected;
	}

	$scope.chooseBackup = function(value){
		$scope.other.powerBackup= value;
		console.log($scope.other.powerBackup);
	}

	$scope.selectOther = function(val){
		console.log(val);
		if($scope.other[val] == undefined) {
			$scope.other[val] = true;
		} else {
			$scope.other[val] = !$scope.other[val];
			if($scope.other[val] == false){
				delete $scope.other[val];
			}
		}
		console.log($scope.other);
	}

	$scope.choosePark = function(){
		$scope.parkSelected = !$scope.parkSelected;
	}

	$scope.selectSize = function(val){
		$scope.other.park = val;
	}

	$scope.save = function(){
		console.log($scope.other);
		$ionicLoading.show({
		    template: 'Loading...'
		  });
		var addProjectDetails = {};
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/other"] = $scope.other;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails).then(function(){
      		$ionicLoading.hide();
      		$ionicPopup.alert({
				title: 'Successful',
				template: 'Project Details updates successfully'
			}).then(function(){
				$state.go('costing-details');
			})
			$scope.other = {};
      	});
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