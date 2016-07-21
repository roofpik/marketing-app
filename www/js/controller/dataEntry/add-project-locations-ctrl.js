app.controller('AddProjectLocationsCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicPopup, $ionicPopover){
	// $ionicLoading.show({
	//     template: 'Loading...'
	// });
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	console.log(projectRequiredDetail);
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;
	$scope.formName = 'all-project-locations';

	$scope.allLocations = [];
	$scope.selectedLocations = [];
	$scope.locations = {};

	getLocations();

	function getLocations(){
		console.log('location/'+ $scope.cityId);
		var locationData = firebase.database().ref('location/'+$scope.cityId);
		console.log(locationData);
	     locationData.on('value', function(data) {
	        console.log(data.val());
	        $timeout(function(){
	        	angular.forEach(data.val(), function(value , key){
	        		$scope.allLocations.push(value);
	        	})
	        },50);   
		});
	}

	$scope.selectLocation = function(value, index){
		//console.log(value.checked);
		if(value.checked == undefined) {
			value.checked = true;
			$scope.selectedLocations.push(value);
		} else {
			value.checked = !value.checked;
			$scope.selectedLocations.splice(index,1);
		}
		console.log($scope.selectedLocations);
	}
	$scope.loc = {
		locationName: '',
		locationId: ''
	}

	$scope.addLocations = function(){
		if($scope.selectedLocations.length){
			console.log($scope.selectedLocations.length);
			angular.forEach($scope.selectedLocations, function(value, key){
				$scope.loc = {
					locationName: value.locationName,
					locationId: value.locationId
				}
				$scope.locations[value.locationId] = $scope.loc;
				$scope.loc = {};
			});
			console.log($scope.locations);
			db.ref($scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/projectDetails/address/locations").update($scope.locations).then(function(){
				console.log('details added');
			});;
		} else {
			console.log($scope.selectedLocations.length);
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
        $state.go('data-entry', {activityId:projectRequiredDetail.activityId});
    }


});