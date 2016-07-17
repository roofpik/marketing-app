app.controller('UnitsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicLoading', function($scope, $timeout, $state, $ionicPopover, $ionicLoading){
	$ionicLoading.show({
	    template: 'Loading...'
	  });

	$timeout(function(){
		$ionicLoading.hide();
	},1000);
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;

	$scope.unitDetails = [];

	$scope.propertyTypes = [
		{id: 'apartment', name: 'Apartment'},
		{id: 'villa', name: 'Villa'},
		{id: 'rowHouse', name: 'Row House'},
		{id: 'studio', name: 'Studio'},
		{id: 'servicedApartment', name: 'Serviced Apartment'}
	];

	$scope.units = {
		configurations: {},
		specifications: {}
	}

	$scope.project = {
		type:''
	}

	$scope.selectProjectType = function(){
		console.log(JSON.parse($scope.project.type));
		$scope.units.configurations.propertyType = JSON.parse($scope.project.type).id;
		console.log($scope.units.configurations.propertyType );
	}

	$scope.configurations2 = [
		{name: 'Super Area', id: 'superArea'},
		{name: 'Carpet Area', id: 'carpetArea'},
		{name: 'Total Balconies', id: 'totalBalconies'},
		{name: 'Total Halls', id: 'totalHalls'},
		{name: 'Total Bedrooms', id: 'totalBedrooms'},
		{name: 'Total Washrooms', id: 'totalWashrooms'},
		{name: 'Number of Parking Spaces', id: 'noOfParkingSpaces'}
	];

	$scope.configurations3 = [
		{name: 'Servant Room', id: 'servantRoom'},
		{name: 'Study Room', id: 'studyRoom'},
		{name: 'Family Lounge', id: 'familyLounge'},
		{name: 'Kitchen', id: 'kitchen'},
		{name: 'Puja Room', id: 'pujaRoom'},
		{name: 'Store Room', id: 'storeRoom'}
	];

	$scope.specifications1 = [
		{name: 'Home Automation', id: 'homeAutomation'},
		{name: 'VRV Air Conditioning', id: 'vrvAirConditioning'},
		{name: 'Kitchen Appliances', id: 'kitchenAppliances'},
		{name: 'Kitchen OTG', id: 'kitchenOTG'},
		{name: 'Kitchen Modular', id: 'kitchenModular'},
		{name: 'Kitchen Dishwasher', id: 'kitchenDishwasher'},
		{name: 'Air Conditioning', id: 'airConditioning'},
		{name: 'Kitchen Chimney', id: 'kitchenChimney'},
		{name: 'Kitchen Microwave Oven', id: 'kitchenMicrowaveOven'},
		{name: 'Kitchen Refrigerator', id: 'kitchenRefrigerator'},
		{name: 'Kitchen Hob', id: 'kitchenHob'},
		{name: 'Fully Furnished', id: 'fullyFurnished'},
		{name: 'Wardrobes', id: 'wardrobes'},
	];

	$scope.specifications2 = [
		{name: 'Shower Cubicle', id: 'showerCubicle'},
		{name: 'Jacuzzi', id: 'jacuzzi'},
		{name: 'Bathtub', id: 'bathTub'}
	];

	$scope.specifications3 = [
		{name: 'Master Bedroom', id: 'flooringMasterBedroom'},
		{name: 'Living Dining', id: 'flooringLivingDining'},
		{name: 'Other Bedrooms', id: 'flooringOtherBedrooms'}
	];
	$scope.flooring = {
	}

	$scope.flooringTypes = [
		{id: 'italianMarble', name: 'Italian Marble'},
		{id: 'importedMarble', name: 'Imported Marble'},
		{id: 'vitrifiedTiles', name: 'Vitrified Tiles'},
		{id: 'laminatedWoodenFlooring', name: 'Laminated Wooden Flooring'},
		{id: 'hardwoodFlooring', name: 'Hardwood Flooring'},
		{id: 'marbleFlooring', name: 'Marble Flooring'},
		{id: 'other', name: 'Other'}
	];

	$scope.selectSpec = function(specification){
		specification.selected = !specification.selected;
		if(!specification.selected){
			delete $scope.units.specifications[specification.id];
		}
	}

	$scope.chooseSpecValue = function(specification, value){
		$scope.units.specifications[specification.id] = value;
		console.log($scope.units.specifications[specification.id].type);
	}

	$scope.selectFlooring = function(value){
		//console.log(value);
		//console.log($scope.flooring[value.id].type);
		$scope.units.specifications[value.id] = JSON.parse($scope.flooring[value.id].type).id;
		console.log($scope.units.specifications[value.id]);
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
		
		var addProjectDetails = {};
		//$scope.units[newkey] = $scope.units;
		var newkey = db.ref($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/units/").push().key;
      	console.log(newkey);
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/units/"+ newkey] = $scope.units;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$scope.unitDetails.push($scope.units);
      	console.log($scope.unitDetails);
      	$scope.units = {};
      	
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
