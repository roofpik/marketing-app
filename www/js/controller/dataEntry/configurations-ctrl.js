app.controller('ConfigurationsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicLoading', function($scope, $timeout, $state, $ionicPopover, $ionicLoading){
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

	$scope.propertyTypes = [
		{id: 'apartment', name: 'Apartment'},
		{id: 'villa', name: 'Villa'},
		{id: 'rowHouse', name: 'Row House'},
		{id: 'studio', name: 'Studio'},
		{id: 'servicedApartment', name: 'Serviced Apartment'}
	];

	$scope.configurations = {};

	$scope.project = {
		type:''
	}

	$scope.selectProjectType = function(){
		console.log(JSON.parse($scope.project.type));
		$scope.configurations.propertyType = JSON.parse($scope.project.type).id;
		console.log($scope.configurations.propertyType );
	}

	$scope.configurations2 = [
		{name: 'Super Area(in sq.ft.)', id: 'superArea'},
		{name: 'Carpet Area', id: 'carpetArea'},
		{name: 'Total Balconies', id: 'totalBalconies'},
		{name: 'Total Bedrooms', id: 'totalBedrooms'},
		{name: 'Total Washrooms', id: 'totalWashrooms'},
		{name: 'Number of Parking Spaces', id: 'noOfParkingSpaces'}
	];

	$scope.configurations3 = [
		{name: 'Servant/Utility Room', id: 'servantUtilityRoom'},
		{name: 'Study Room', id: 'studyRoom'},
		{name: 'Family Lounge', id: 'familyLounge'},
		{name: 'Kitchen', id: 'kitchen'},
		{name: 'Puja/Store Room', id: 'pujaStoreRoom'},
		{name: 'Hall', id: 'hall'}
	];

	$scope.selectConfig = function(val){
		console.log(val);
		if($scope.configurations[val] == undefined) {
			$scope.configurations[val] = true;
		} else {
			$scope.configurations[val] = !$scope.configurations[val];
			if($scope.configurations[val] == false){
				delete $scope.configurations[val];
			}
		}
	}

	$scope.addThisUnit = function(){
		console.log($scope.configurations);
		
		var addProjectDetails = {};
		//$scope.units[newkey] = $scope.units;
		var newkey = db.ref($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/units/configurations").push().key;
      	console.log(newkey);
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/units/configurations/"+ newkey] = $scope.configurations;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$scope.configurations = {};
      	
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
