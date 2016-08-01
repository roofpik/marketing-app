app.controller('AddProjectLocationsCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicPopup, $ionicPopover){
	$ionicLoading.show({
	    template: 'Loading...'
	});
	$timeout(function(){
		$ionicLoading.hide();
	}, 8000);
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	console.log(projectRequiredDetail);
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;
	$scope.projectName = '';
	$scope.formName = 'all-project-locations';

	$scope.allLocations = [];
	$scope.selectedLocations = [];
	$scope.existingLocations = [];
	$scope.locations = {};

	getProjectLocations();

	function getProjectLocations() {
		$scope.existingLocations = [];
        db.ref($scope.projectType+'/'+$scope.cityId +'/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/projectDetails/address/locations').once('value', function(snapshot){
            console.log(snapshot.val());
            $timeout(function(){
            	angular.forEach(snapshot.val(), function(value, key){
	            	$scope.existingLocations.push(value);
	            })
            },500);
        }).then(function(){
        	db.ref($scope.projectType+'/'+$scope.cityId +'/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/projectName').once('value', function(data){
        		console.log(data.val());
        		$scope.projectName = data.val();
        	})
        	getLocations();
        })
    }

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
	        	$ionicLoading.hide();
	        },500);   
		});
	}

	$scope.selectLocation = function(value, index){
		var exist = false;
		angular.forEach($scope.existingLocations, function(value1, key1){
			if(value1.locationId == value.locationId){
				exist = true;
			}
		})
		//console.log(value.checked);
		if(exist){
			$ionicPopup.alert({
				title:'Location already exists',
				template: 'Please select a different location'
			});
		} else{
			if(value.checked == undefined) {
				value.checked = true;
				$scope.selectedLocations.push(value);
			} else {
				value.checked = !value.checked;
				$scope.selectedLocations.splice(index,1);
			}
			console.log($scope.selectedLocations);
		}
	}
	
	$scope.loc = {
		locationName: '',
		locationId: ''
	}

	$scope.addLocations = function(){
		$ionicLoading.show({
		    template: 'Loading...'
		});
		$timeout(function(){
			$ionicLoading.hide();
		}, 8000);
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
				$scope.addProjectToLocations();
			});;
		} else {
			console.log($scope.selectedLocations.length);
			$ionicLoading.hide();
			$ionicPopup.alert({
					title: 'Location not selected',
					template: 'Please select at least one location'
				}).then(function(){
					
				});
		}
	}

	$scope.addProjectToLocations = function(){
		$scope.insertProject = {
			projectId: $scope.projectId,
			projectName: $scope.projectName
		}

		var num = $scope.selectedLocations.length;
		var x = 0;
		angular.forEach($scope.locations, function(value, key){
			console.log(num, x);
			db.ref('location/'+$scope.cityId+'/'+value.locationId+'/projectAccess/residential/'+$scope.projectId).update($scope.insertProject).then(function(){
				x++;
				if(x == num){
					$ionicLoading.hide();
					$ionicPopup.alert({
						title: 'Successful',
						template: 'Project Details updates successfully'
					}).then(function(){
						$state.go('standout-features');
					})
				}
			});
		})
	}

	$scope.removeLocation = function(location){

		$ionicLoading.show({
			template: 'Loading...'
		})
		$timeout(function(){
			$ionicLoading.hide();
		}, 8000);
		console.log(location);
		db.ref('location/'+$scope.cityId+'/'+location.locationId+'/projectAccess/residential/'+$scope.projectId).remove().then(function(){
			db.ref($scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/projectDetails/address/locations/"+location.locationId).remove().then(function(){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Location Removed Successfully'
				}).then(function(){
					$ionicLoading.show({
							template: 'Loading...'
						})
					getProjectLocations();
				})
			});
		});
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


});