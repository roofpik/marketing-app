app.controller('EditConfigurationCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicLoading', '$ionicPopup', '$stateParams', function($scope, $timeout, $state, $ionicPopover, $ionicLoading, $ionicPopup, $stateParams){
	$ionicLoading.show({
	    template: 'Loading...'
	  });

	$timeout(function(){
		$ionicLoading.hide();
	},8000);
	console.log($stateParams.unit);

	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;
	console.log($scope.projectId);

	$scope.project = {
		type: ''
	}

	$scope.existingUnits = [];

	getUnitDetails();

	function getUnitDetails(){
		console.log($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/units/configurations");
		db.ref($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/units/configurations").once('value', function(snapshot){
			console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				if(key == $stateParams.unit){
					$scope.selectedUnit = value;
				} else {
					$scope.existingUnits.push(value);
				}
			})
		}).then(function(){
			$ionicLoading.hide();
			console.log($scope.selectedUnit,$scope.existingUnits);
		});
	}

	$scope.propertyTypes = [
		{id: 'apartment', name: 'Apartment'},
		{id: 'villa', name: 'Villa'},
		{id: 'rowHouse', name: 'Row House'},
		{id: 'studio', name: 'Studio'},
		{id: 'servicedApartment', name: 'Serviced Apartment'},
		{id: 'penthouse', name: 'Penthouse'}
	];

	$scope.configurations1 = [
		{name: 'Super Area(in sq.ft.)', id: 'superArea'},
		{name: 'Carpet Area(in sq.ft.)', id: 'carpetArea'},
		{name: 'Total Balconies', id: 'totalBalconies'},
		{name: 'Total Bedrooms', id: 'totalBedrooms'},
		{name: 'Total Washrooms', id: 'totalWashrooms'},
		{name: 'Number of Parking Spaces', id: 'noOfParkingSpaces'}
	];

	$scope.configurations2 = [
		{name: 'Servant/Utility Room', id: 'servantUtilityRoom'},
		{name: 'Study Room', id: 'studyRoom'},
		{name: 'Family Lounge', id: 'familyLounge'},
		{name: 'Kitchen', id: 'kitchen'},
		{name: 'Puja/Store Room', id: 'pujaStoreRoom'},
		{name: 'Hall', id: 'hall'}
	];

	$scope.selectProjectType = function(){
		console.log(JSON.parse($scope.project.type));
		$scope.selectedUnit.propertyType = JSON.parse($scope.project.type).id;
		console.log($scope.selectedUnit.propertyType );
	}

	$scope.exist = false;

	$scope.submitEdited = function(){
		angular.forEach($scope.selectedUnit, function(value, key){
			console.log(value, key);
			if(value == null){
				delete $scope.selectedUnit[key];
			}
		});
		angular.forEach($scope.existingUnits, function(value, key){
			if(value.superArea == $scope.selectedUnit.superArea && value.type == $scope.selectedUnit.type && value.propertyType == $scope.selectedUnit.propertyType){
				$scope.exist = true;
			}
		});
		if($scope.exist){
			$ionicPopup.alert({
				title:'Unit already added'
			}).then(function(){
				$scope.exist = false;
			})
		}else{
			console.log($scope.selectedUnit);
			//console.log($scope.projectType+'/'+$scope.cityId+'/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/units/configurations/'+$stateParams.unit);
			var updates = {};
			updates[$scope.projectType+'/'+$scope.cityId+'/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/units/configurations/'+$stateParams.unit] = $scope.selectedUnit;
			console.log(updates);
			db.ref().update(updates).then(function(){
				$ionicPopup.alert({
					title:'Edited successfully'
				}).then(function(){
					$state.go('configurations');
				})
			})
		}
	}

	$scope.selectConfig = function(val){
		console.log(val);
		if($scope.selectedUnit[val] == undefined) {
			$scope.selectedUnit[val] = true;
		} else {
			$scope.selectedUnit[val] = !$scope.selectedUnit[val];
			if($scope.selectedUnit[val] == false){
				delete $scope.selectedUnit[val];
			}
		}
	}

	$scope.goBack = function(){
		$state.go('configurations');
	}

}]);
