app.controller('ConnectivityDetailsCtrl',['$scope', '$timeout', '$state', '$ionicPopover', function($scope, $timeout, $state, $ionicPopover){
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	$scope.formName = 'connectivity-details';
	console.log($scope.project);
	$scope.connectivity = {
		airport: {},
		cabStand: {},
		autoStand: {},
		metroStation: {},
		railwayStation: {},
		busStand: {}
	};

	$scope.connectivity1 = [
		{name:'Airport', id:'airport'},
		{name: 'Metro Station', id:'metroStation'},
		{name:'Railway Station', id:'railwayStation'},
		{name:'Bus Stand', id:'busStand'}
	];
	$scope.params1= [
		{name: 'Latitude', id: 'lat'},
		{name:'Longitude', id:'lng'},
		{name:'Distance', id: 'distance'},
		{name: 'Peak Time', id:'peakTime'},
		{name: 'Off Peak Time', id: 'offPeakTime'}
	];
	$scope.connectivity2 = [
		{name:'Cab Stand', id:'cabStand'},
		{name: 'Auto Stand', id:'autoStand'}
	];
	$scope.params2 = [
		{name: 'Latitude', id: 'lat'},
		{name:'Longitude', id:'lng'},
		{name:'Distance', id:'distance'}
	];

	$scope.otherMeans = [
		{name1: 'Nearest Main Road', id1: 'nearestMainRoad', name2: 'Main Road Distance', id2: 'mainRoadDistance'},
		{name1: 'Nearest Expressway', id1: 'nearestExpressway', name2: 'Expressway Distance', id2: 'expresswayDistance'}
	];

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

	$scope.save = function(){
		console.log($scope.connectivity);
		$scope.project.connectivity = $scope.connectivity;
		window.localStorage['project'] = JSON.stringify($scope.project);
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/"+ $scope.project.projectId+'/'+$scope.project.version+ "/connectivity"] = $scope.connectivity;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('society-shops');
      	},2000);
	}
}]);