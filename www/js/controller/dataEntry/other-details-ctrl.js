app.controller('OtherDetailsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover',function($scope, $timeout, $state,$ionicPopover){
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	$scope.formName ='other-details';
	console.log($scope.project);
	$scope.other = {};
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
		$scope.project.other = $scope.other;
		window.localStorage['project'] = JSON.stringify($scope.project);
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/other"] = $scope.other;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('costing-details');
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