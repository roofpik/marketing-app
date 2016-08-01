app.controller('SecurityDetailsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', '$ionicPopup', '$ionicLoading', function($scope, $timeout, $state, $ionicPopover,$ionicPopup, $ionicLoading){
	$ionicLoading.show({
	    template: 'Loading...'
	  });
	$timeout(function(){
		$ionicLoading.hide();	
	}, 8000);
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;
	$scope.formName = 'security';
	$scope.security = {
		mainGate: {

		},
		tower: {

		}
	}
	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/security').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.security = snapshot.val();
            	console.log($scope.security);
            } 
            $ionicLoading.hide(); 
         });
    };

	$scope.selectMainGateSecurity = function(val){
		console.log(val);
		if($scope.security.mainGate[val] == undefined) {
			$scope.security.mainGate[val] = true;
		} else {
			$scope.security.mainGate[val] = !$scope.security.mainGate[val];
			if($scope.security.mainGate[val] == false){
				delete $scope.security.mainGate[val];
			}
		}
		console.log($scope.security.mainGate);
	}

	$scope.selectTowerSecurity = function(val){
		console.log(val);
		if($scope.security.tower[val] == undefined) {
			$scope.security.tower[val] = true;
		} else {
			$scope.security.tower[val] = !$scope.security.tower[val];
			if($scope.security.tower[val] == false){
				delete $scope.security.tower[val];
			}
		}
		console.log($scope.security.tower);
	}

	$scope.selectOtherSecurity = function(val){
		console.log(val);
		if($scope.security[val] == undefined) {
			$scope.security[val] = true;
		} else {
			$scope.security[val] = !$scope.security[val];
			if($scope.security[val] == false){
				delete $scope.security[val];
			}
		}
		console.log($scope.security);
	}

	$scope.save = function(){
		console.log($scope.security);
		var addProjectDetails = {};
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/security"] = $scope.security;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$ionicPopup.alert({
			title: 'Successful',
			template: 'Project Details updates successfully'
		}).then(function(){
			$scope.security = {};
			$state.go('costing-details');
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

	$scope.goBack = function(){
        console.log('called');
        $state.go('all-forms');
    }

}]);