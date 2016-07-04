app.controller('SecurityDetailsCtrl', ['$scope', '$timeout', '$state', '$ionicPopover', function($scope, $timeout, $state, $ionicPopover){
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	$scope.formName = 'society-shops';
	console.log($scope.project);
	$scope.security = {
		mainGate: {

		},
		tower: {

		}
	}

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
		$scope.project.security = $scope.security;
		window.localStorage['project'] = JSON.stringify($scope.project);
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/security"] = $scope.security;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('costing-details');
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