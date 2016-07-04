app.controller('RwaDetailsCtrl',['$scope', '$timeout', '$state', '$ionicPopover', function($scope, $timeout, $state, $ionicPopover){
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	$scope.formName = 'rwa-details';
	console.log($scope.project);
	$scope.rwa = {};
	$scope.save = function(){
		//console.log($scope.rwa);
		$scope.project.rwa = $scope.rwa;
		window.localStorage['project'] = JSON.stringify($scope.project);
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/rwa"] = $scope.rwa;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('security-details');
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