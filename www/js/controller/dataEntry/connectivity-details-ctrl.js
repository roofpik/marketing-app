app.controller('ConnectivityDetailsCtrl',['$scope', '$timeout', '$state', '$ionicPopover','$ionicPopup', function($scope, $timeout, $state, $ionicPopover, $ionicPopup){
	$scope.formName = 'connectivity-details';
	var projectRequiredDetail = JSON.parse(window.localStorage['projectRequiredDetail']);
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;

	$scope.connectivity = {
		airport: {},
		cabStand: {},
		autoStand: {},
		metroStation: {},
		railwayStation: {},
		busStand: {}
	};

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/connectivity').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.connectivity = snapshot.val();
            	console.log($scope.connectivity);
            }  
         });
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
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/"+ $scope.projectId+'/'+$scope.editableVersion+ "/connectivity"] = $scope.connectivity;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$ionicPopup.alert({
			title: 'Successful',
			template: 'Project Details updates successfully'
		})
		$scope.connectivity = {};
	}
}]);