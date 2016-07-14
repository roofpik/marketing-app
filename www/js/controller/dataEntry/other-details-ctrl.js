app.controller('OtherDetailsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicPopup', '$ionicLoading',function($scope, $timeout, $state,$ionicPopover,$ionicPopup, $ionicLoading){
	$ionicLoading.show({
	    template: 'Loading...'
	  });
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;

	$scope.formName ='other-details';

	$scope.other = {};

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/other').once('value', function(snapshot) {
            if(snapshot.val() != null){
            	$scope.other = snapshot.val();
            	console.log($scope.other);
            }
            $ionicLoading.hide(); 
         });
    };


	$scope.parameters = [
		{id:'powerBackup', name:'Power Backup'},
		{id:'maintenance', name:'Maintenance'},
		{id:'waitingLoungeInTower', name:'Waiting Lounge In Tower'},
		{id:'airConditioningInWaitingLounge', name: 'Air Conditioning In Waiting Lounge'},
		{id:'petFriendly', name: 'Pet Friendly'},
		{id:'wheelchairFriendly', name: 'Wheelchair Friendly'},
		{id:'playSchool', name: 'Play School'},
		{id:'daycare', name: 'Daycare'},
		{id:'atm', name: 'ATM'},
		{id:'grocery', name: 'Grocery'},
		{id:'pharmacy', name: 'Pharmacy'},
		{id:'parlour', name: 'Parlour'},
		{id:'park', name: 'Park'},
		{id:'laundry', name: 'Laundry'},
		{id:'bank', name: 'Bank'},
		{id: 'centralWifi', name: 'Central WiFi'},
		{id: 'DTHCabling', name: 'DTH Cabling'},
		{id: 'IPTVReady', name: 'IPTV Ready'},
		{id: 'ultaHighSpeedBroadband', name: 'Ultra High Speed Broadband'},
		{id: 'highSpeedElevators', name: 'High Speed Elevators'},
		{id: 'gasPipelines', name: 'Gas Pipelines'}
	];

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

	$scope.save = function(){
		console.log($scope.other);
		$ionicLoading.show({
	    template: 'Loading...'
	  });
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/other"] = $scope.other;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$ionicPopup.alert({
			title: 'Successful',
			template: 'Project Details updates successfully'
		}).then(function(){
			$ionicLoading.hide();
		})
		$scope.other = {};
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