app.controller('CostingDetailsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicPopup', '$ionicLoading', function($scope, $timeout, $state, $ionicPopover,$ionicPopup, $ionicLoading){
	
	$ionicLoading.show({
	    template: 'Loading...'
	  }); 
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;

	$scope.formName = 'costing-details';
	$scope.costing = {};
	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/costing').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.costing = snapshot.val();
            	console.log($scope.costing);
            }
            $ionicLoading.hide();
         });
    };
	$scope.parameters = [
		{id:'powerBackupCharges', name:'Power Backup Charges'},
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
		{id:'carWashCharges', name: 'Car Wash Charges'}
	];

	$scope.save = function(){
		console.log($scope.costing);
		$ionicLoading.show({
		    template: 'Loading...'
		  }); 
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/costing"] = $scope.costing;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$ionicPopup.alert({
			title: 'Successful',
			template: 'Project Details updates successfully'
		}).then(function(){
			$ionicLoading.hide();
		})
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