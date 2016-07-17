app.controller('CostingDetailsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicPopup', '$ionicLoading', function($scope, $timeout, $state, $ionicPopover,$ionicPopup, $ionicLoading){
	
	$ionicLoading.show({
	    template: 'Loading...'
	  }); 
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;
	console.log($scope.projectType);

	$scope.formName = 'costing-details';
	$scope.costing = {};
	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/costing').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.costing = snapshot.val();
            	console.log($scope.costing);
            }
            $ionicLoading.hide();
         });
    };
	$scope.parameters = [
		{id:'powerBackupChargesFixed', name:'Power Backup Charges Fixed'},
		{id:'powerBackupChargesVariable', name:'Power Backup Charges Variable'},
		{id:'maintenanceChargesFixed', name:'Maintenance Charges Fixed'},
		{id:'maintenanceChargesVariable', name:'Maintenance Charges Variable'},
		{id:'moveInCharges', name: 'Move In Charges'},
		{id:'moveOutCharges', name: 'Move Out Charges'},
		{id:'cookingChargeOneMeal', name: 'Cooking Charges One Meal'},
		{id:'cookingChargeTwoMeals', name: 'Cooking Charges Two Meals'},
		{id:'cleaningUtensilsOneTime', name: 'Cleaning Utensils One Time'},
		{id:'cleaningUtensilsTwoTime', name: 'Cleaning Utensils Two Time'},
		{id:'maid12Hours', name: 'Maid 12 Hours'},
		{id:'maid24Hours', name: 'Maid 24 Hours'},
		{id:'carParkingCharges', name: 'Car Parking Charges'},
		{id:'extraCarParkingCharges', name: 'Extra Car Parking Charges'},
		{id: 'EDC-IDC', name: 'EDC/IDC'},
		{id: 'IFMS', name: 'IFMS'},
		{id: 'PLC', name: 'PLC'},
		{id: 'clubHouse', name: 'ClubHouse'}
	];

	$scope.save = function(){
		console.log($scope.costing);
		$ionicLoading.show({
		    template: 'Loading...'
		  }); 
		var addProjectDetails = {};
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/costing"] = $scope.costing;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails).then(function(){
      		$ionicLoading.hide();
      		$ionicPopup.alert({
				title: 'Successful',
				template: 'Project Details updates successfully'
			})
      	});
		$scope.costing = {};
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