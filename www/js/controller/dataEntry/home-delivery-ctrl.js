app.controller('HomeDeliveryCtrl', ['$scope', '$ionicPopover', '$timeout', '$state', function($scope,$ionicPopover,$timeout, $state){
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	console.log($scope.project);
	$scope.homeDelivery = {
		restaurant: [],
		grocery: [],
		pharmacy: [],
		parlour: [],
		cableProvider: [],
		isp: [],
		milkman: [],
		newspaperDelivery: [],
		laundry: []
	};
	$scope.homeDeliveryDetails = {};

	$scope.vendors = [];

	$scope.vendorsCount = 0;
	$scope.vendorType = '';

	$scope.selectShop = function(value){
		$scope.vendorType = value;
		console.log($scope.vendorType);
	}

	$scope.addShop = function(){
		var addProjectDetails = {};
		console.log($scope.homeDeliveryDetails);
		if($scope.homeDeliveryDetails.name != undefined && $scope.homeDeliveryDetails.name != '' && $scope.homeDeliveryDetails.contact != undefined && $scope.homeDeliveryDetails.contact != '' && $scope.vendorType != ''){
			var newKey = db.ref("protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/"+$scope.project.projectId+'/'+$scope.project.version+"/homeDelivery/"+$scope.vendorType).push().key;
			addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/"+$scope.project.projectId+'/'+$scope.project.version+"/homeDelivery/"+$scope.vendorType+'/'+newKey] = $scope.homeDeliveryDetails;
	 		db.ref().update(addProjectDetails);
	 		console.log(addProjectDetails);
	 		$scope.homeDeliveryDetails.type = $scope.vendorType;
	 		$scope.vendors.push($scope.homeDeliveryDetails);
	 		$scope.vendorsCount++;
	 		$scope.homeDeliveryDetails = {};
		}
	}


	$scope.homeDelivery = function(){
		console.log($scope.project);
		$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('units');
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