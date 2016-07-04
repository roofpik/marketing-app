app.controller('ProjectBasicDetailsCtrl', ['$scope', '$stateParams','$ionicPopup', '$state', '$timeout', '$ionicPopover', function($scope, $stateParams, $ionicPopup, $state,$timeout, $ionicPopover){

	$scope.projectId=localStorage.getItem("projectid");
	$scope.cityId=localStorage.getItem("cityid");
	console.log($scope.projectId);
	console.log($scope.cityId);
	$scope.editable="";
	$scope.projectDetails={};
	$scope.editableVersion = '';

	function getProjectEditable() {
		console.log($scope.projectId);
		console.log('protectedResidentialVersions/'+$scope.cityId+'/projects/'+$scope.projectId);
		var newData = firebase.database().ref('protectedResidentialVersions/'+$scope.cityId+'/projects/'+$scope.projectId+'/editable');
	    newData.on('value', function(data) {
	    	console.log(data.val().version);
	    	$scope.editableVersion = data.val().version;
	    });
		getProjectDetails();
    };

    function getProjectDetails(){
	
        firebase.database().ref('/protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion).once('value', function(snapshot) {
            $scope.project = snapshot.val();
            angular.forEach(snapshot.val(), function(value, key){
            	$scope.project = value;
            })   
            console.log($scope.project);
            window.localStorage['project'] = JSON.stringify($scope.project);
			$scope.projectDetails = {
				builderName: $scope.project.projectDetails.builderName,
				builderId: $scope.project.projectDetails.builderId,
				projectName: $scope.project.projectDetails.projectName,
				address: {
					landmark: $scope.project.projectDetails.address.landmark,
					cityName: $scope.project.projectDetails.address.cityName,
					cityId: $scope.project.projectDetails.address.cityId,
					zoneName: $scope.project.projectDetails.address.zoneName,
					zoneId: $scope.project.projectDetails.address.zoneId,
				},
				partners: {
				},
				approvedBankLoans: {
				},
				projectType : {
				},
				floors: {
				},
				lifts: {
				}
			};  
          
        getLocations();   
        });
    };

	 getProjectEditable();


	// $scope.project = JSON.parse(window.localStorage['project'] || {});
	 $scope.formName = 'project-basic-details';
	// console.log($scope.project);
	// $scope.projectId = $scope.project.projectId;
	$scope.locations = [];
	$scope.wantLocations = false;

	// getLocations();

	function getLocations(){
		var locationData = firebase.database().ref('location/'+$scope.project.projectDetails.address.cityId).orderByChild('zoneId').equalTo($scope.project.projectDetails.address.zoneId);
		console.log(locationData);
	     locationData.on('value', function(data) {
	        console.log(data.val());
	        $timeout(function(){
	        	angular.forEach(data.val(), function(value, key){
		         	$scope.locations.push(value);
		         	//$timeout(function(){console.log($scope.zones);},50);
		         })
		        console.log($scope.locations);	
	        },50);   
		});
	}

	// $scope.projectDetails = {
	// 	builderName: $scope.project.projectDetails.builderName,
	// 	builderId: $scope.project.projectDetails.builderId,
	// 	projectName: $scope.project.projectDetails.projectName,
	// 	address: {
	// 		landmark: $scope.project.projectDetails.address.landmark,
	// 		cityName: $scope.project.projectDetails.address.cityName,
	// 		cityId: $scope.project.projectDetails.address.cityId,
	// 		zoneName: $scope.project.projectDetails.address.zoneName,
	// 		zoneId: $scope.project.projectDetails.address.zoneId,
	// 	},
	// 	partners: {
	// 	},
	// 	approvedBankLoans: {
	// 	},
	// 	projectType : {
	// 	},
	// 	floors: {
	// 	},
	// 	lifts: {
	// 	}
	// }

	$scope.type = [false, false, false, false, false];

	$scope.selectType = function(val){
		console.log(val);
		for(var i = 0; i < 5; i++){
			if(val == i){
				$scope.type[i] = !$scope.type[i];
			}
		}
	}

	$scope.extra = [false, false, false];

	$scope.selectExtras = function(val){
		for(var i = 0; i < 3; i++){
			//console.log(i, val-1);
			if(val == i){
				$scope.extra[i] = !$scope.extra[i];
				//console.log($scope.extra[i]);
			}
		}
	}

	$scope.banks = [false, false, false, false, false, false];

	$scope.selectBank = function(val){
		console.log(val);
		for(var i = 0; i < 6; i++){
			if(val == i){
				$scope.banks[i] = !$scope.banks[i];
			}
		}
	}

	$scope.displayLocation = function(){
		$scope.wantLocations = !$scope.wantLocations;
	}

	$scope.selectLocation = function(value){
		console.log(value);
		if(value.checked == undefined) {
			value.checked = true;
		} else {
			value.checked = !value.checked;
			// if(value.checked == false){
			// 	delete $scope.other[val];
			// }
		}
		console.log($scope.locations);
	}

	$scope.chosenLocations = [];
	$scope.lala = {
		locationName: '',
		locationId: ''
	}

	$scope.save = function(){
		//console.log($scope.banks);
		if($scope.type[0] == true){
			$scope.projectDetails.projectType.apartment = true;
		}
		if($scope.type[1] == true){
			$scope.projectDetails.projectType.villa = true;
		}
		if($scope.type[2] == true){
			$scope.projectDetails.projectType.rowHouse = true;
		}
		if($scope.type[3] == true){
			$scope.projectDetails.projectType.studio = true;
		}
		if($scope.type[4] == true){
			$scope.projectDetails.projectType.servicedApartment = true;
		}

		if($scope.extra[0] == true){
			$scope.projectDetails.carParking = true;
		}
		if($scope.extra[1]==true){
			$scope.projectDetails.visitorParking = true;
		}
		if($scope.extra[2] == true){
			$scope.projectDetails.vastuCompliant = true;
		}

		if($scope.banks[0] == true){
			$scope.projectDetails.approvedBankLoans.HDFC = true;
		}
		if($scope.banks[1] == true){
			$scope.projectDetails.approvedBankLoans.SBI = true;
		}
		if($scope.banks[2] == true){
			$scope.projectDetails.approvedBankLoans.AXIS = true;
		}
		if($scope.banks[3] == true){
			$scope.projectDetails.approvedBankLoans.ICICI = true;
		}
		if($scope.banks[4] == true){
			$scope.projectDetails.approvedBankLoans.KOTAK = true;
		}
		if($scope.banks[5] == true){
			$scope.projectDetails.approvedBankLoans.HSBC = true;
		}

		var addProjectDetails = {};

		console.log($scope.projectDetails);

      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId +'/'+$scope.project.version+"/projectDetails"] = $scope.projectDetails;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$scope.projectInfo = {
      		projectId: $scope.project.projectId,
      		projectName: $scope.project.projectDetails.projectName,
      		version: $scope.project.version
      	}

       	var locationsData = {};

		angular.forEach($scope.locations, function(value, key){
			if(value.checked){
				$scope.lala.locationName = value.locationName;
				$scope.lala.locationId = value.locationId;
				console.log('protectedResidential/'+$scope.project.projectDetails.address.cityId+'/projects/'+$scope.project.projectId+'/'+$scope.project.version+'/projectDetails/address/locations/'+value.locationId);
				locationsData['protectedResidential/'+$scope.project.projectDetails.address.cityId+'/projects/'+$scope.project.projectId+'/'+$scope.project.version+'/projectDetails/address/locations/'+value.locationId] =$scope.lala;
				locationsData['location/'+$scope.project.projectDetails.address.cityId+'/'+$scope.lala.locationId+'/projects/'+$scope.project.projectId] = $scope.projectInfo;
			}
		});
		 console.log(locationsData);
      	db.ref().update(locationsData);

      	$ionicPopup.alert({
			title: 'Successful',
			template: 'Project created successfully'
		}).then(function(response){
			$scope.project.projectDetails = $scope.projectDetails;
			window.localStorage['project'] = JSON.stringify($scope.project);
			$state.go('sports-n-clubhouse');
		})
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