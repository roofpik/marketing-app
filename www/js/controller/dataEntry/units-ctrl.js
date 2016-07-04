app.controller('UnitsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', function($scope, $timeout, $state, $ionicPopover){
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	$scope.formName = 'units-ctrl';
	console.log($scope.project);

	$scope.unitDetails = [];

	$scope.configurations1 = [
		{name: 'Property Type', id: 'propertyType'},
		{name: 'Type', id: 'type'},
	];

	$scope.configurations2 = [
		{name: 'Price', id: 'price'},
		{name: 'Super Area', id: 'superArea'},
		{name: 'Carpet Area', id: 'carpetArea'},
		{name: 'Total Balconies', id: 'totalBalconies'},
		{name: 'Total Halls', id: 'totalHalls'},
		{name: 'Total Bedrooms', id: 'totalBedrooms'},
		{name: 'Total Washrooms', id: 'totalWashrooms'}
	];

	$scope.configurations3 = [
		{name: 'Servant Room', id: 'servantRoom'},
		{name: 'Study Room', id: 'studyRoom'},
		{name: 'Family Lounge', id: 'familyLounge'},
		{name: 'Kitchen', id: 'kitchen'},
		{name: 'Puja Room', id: 'pujaRoom'},
		{name: 'Store Room', id: 'storeRoom'}
	];

	$scope.specifications = [
		{name: 'Shower Cubicle', id: 'showerCubicle'},
		{name: 'Home Automation', id: 'homeAutomation'},
		{name: 'VRV Air Conditioning', id: 'vrvAirConditioning'},
		{name: 'Kitchen Appliances', id: 'kitchenAppliances'},
		{name: 'Kitchen OTG', id: 'kitchenOTG'},
		{name: 'Bathtub', id: 'bathTub'},
		{name: 'Kitchen Modular', id: 'kitchenModular'},
		{name: 'Kitchen Dishwasher', id: 'kitchenDishwasher'},
		{name: 'Air Conditioning', id: 'airConditioning'},
		{name: 'Flooring Master Bedroom', id: 'flooringMasterBedroom'},
		{name: 'Kitchen Chimney', id: 'kitchenChimney'},
		{name: 'Flooring Living Dining', id: 'flooringLivingDining'},
		{name: 'Kitchen Microwave Oven', id: 'kitchenMicrowaveOven'},
		{name: 'Jacuzzi', id: 'jacuzzi'},
		{name: 'Kitchen Refrigerator', id: 'kitchenRefrigerator'},
		{name: 'Flooring Other Bedrooms', id: 'flooringOtherBedrooms'},
		{name: 'Kitchen Hob', id: 'kitchenHob'},
		{name: 'Fully Furnished', id: 'fullyFurnished'},
		{name: 'Wardrobes', id: 'wardrobes'}
	];

	$scope.units = {
		configurations: {},
		specifications: {}
	}

	$scope.selectConfig = function(val){
		console.log(val);
		if($scope.units.configurations[val] == undefined) {
			$scope.units.configurations[val] = true;
		} else {
			$scope.units.configurations[val] = !$scope.units.configurations[val];
			if($scope.units.configurations[val] == false){
				delete $scope.units.configurations[val];
			}
		}
	}

	$scope.selectSpecification = function(val){
		console.log(val);
		if($scope.units.specifications[val] == undefined) {
			$scope.units.specifications[val] = true;
		} else {
			$scope.units.specifications[val] = !$scope.units.specifications[val];
			if($scope.units.specifications[val] == false){
				delete $scope.units.specifications[val];
			}
		}
	}

	$scope.addThisUnit = function(){
		console.log($scope.units);
		$scope.project.units = $scope.units;
		window.localStorage['project'] = JSON.stringify($scope.project);
		var addProjectDetails = {};
		var newkey = db.ref("protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/"+$scope.project.projectId+'/'+$scope.project.version+"/units/").push().key;
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/units/"+ newkey] = $scope.units;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$scope.unitDetails.push($scope.units);
      	console.log($scope.unitDetails);
      	$scope.units = {};
      	$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		console.log($scope.project);
      		//$state.go('costing-details');
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