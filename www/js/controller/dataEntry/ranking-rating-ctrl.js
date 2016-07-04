app.controller('RankingRatingCtrl', ['$scope', '$state', '$timeout', '$ionicPopover', function($scope, $state, $timeout, $ionicPopover){
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	$scope.formName ='ranking-rating';
	console.log($scope.project);

	$scope.ratings = {};
	$scope.ranking = {};
	$scope.priceRange = {
		buy: {},
		rent: {}
	};
	$scope.areas = {};

	$scope.save = function(){
		$scope.project.ratings = $scope.ratings;
		$scope.project.ranking = $scope.ranking;
		$scope.project.priceRange = $scope.priceRange;
		$scope.project.areas = $scope.areas;
		window.localStorage['project'] = JSON.stringify($scope.project);
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/ratings"] = $scope.ratings;
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/ranking"] = $scope.ranking;
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/priceRange"] = $scope.priceRange;
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/areas"] = $scope.areas;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$timeout(function(){
      		console.log($scope.project);
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		//$state.go('costing-details');
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