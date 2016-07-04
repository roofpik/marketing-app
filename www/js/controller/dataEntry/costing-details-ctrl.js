app.controller('CostingDetailsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', function($scope, $timeout, $state, $ionicPopover){
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	$scope.formName = 'costing-details';
	console.log($scope.project);
	$scope.costing = {};
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
		$scope.project.costing = $scope.costing;
		window.localStorage['project'] = JSON.stringify($scope.project);
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/costing"] = $scope.costing;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('connectivity-details');
      	},2000);
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

}]);