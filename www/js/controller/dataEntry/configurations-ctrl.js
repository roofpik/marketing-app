app.controller('ConfigurationsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicLoading', '$ionicPopup', function($scope, $timeout, $state, $ionicPopover, $ionicLoading, $ionicPopup){
	$ionicLoading.show({
	    template: 'Loading...'
	  });

	$timeout(function(){
		$ionicLoading.hide();
	},8000);
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

	getProjectDetails();

	$scope.existingUnits = [];

	function getProjectDetails(){
		console.log($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/units/configurations");
		db.ref($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/units/configurations").once('value', function(snapshot){
			console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				$scope.existingUnits.push(value);
			})
		}).then(function(){
			$ionicLoading.hide();
			console.log($scope.existingUnits);
		});
	}

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
		{name: 'Carpet Area(in sq.ft.)', id: 'carpetArea'},
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

	$scope.exist = false;

	$scope.addThisUnit = function(x){
		console.log(x);
		if($scope.configurations.propertyType != undefined && $scope.configurations.superArea != undefined){
			console.log($scope.configurations);
			angular.forEach($scope.existingUnits, function(value, key){
				console.log(value.superArea, $scope.configurations.superArea);
				if(value.superArea == $scope.configurations.superArea && value.type == $scope.configurations.type){
					console.log('exists');
					$scope.exist = true;
				}
			})

			console.log($scope.exist);

			if($scope.exist){
				$ionicPopup.alert({
					title: 'Already exists',
					template: 'This unit already exists'
				}).then(function(){
					$scope.configurations = {};
					$scope.exist = false;
					window.location.reload(true);
				})
			} else {
				var addProjectDetails = {};
				//$scope.units[newkey] = $scope.units;
				var newkey = db.ref($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/units/configurations").push().key;
		      	console.log(newkey);
		      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/units/configurations/"+ newkey] = $scope.configurations;
		      	console.log(addProjectDetails);
		      	db.ref().update(addProjectDetails).then(function(){
		      		$scope.existingUnits.push($scope.configurations);
		      		$scope.configurations = {};
			      	$scope.exist = false;
			      	if(x == 1){
			      		window.location.reload(true);
			      	} else {
			      		$state.go('sports-n-clubhouse');
			      	}
			      	
		      	});
			}
		} else {
			$ionicPopup.alert({
				title:'Empty Fields',
				template: 'Please select a unit type enter the super area'
			})
		}
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
        $state.go('all-forms');
    }

    $scope.next = function(){
  		$state.go('sports-n-clubhouse');
    }

}]);
