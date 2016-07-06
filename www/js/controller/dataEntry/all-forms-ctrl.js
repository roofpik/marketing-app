app.controller('AllFormsCtrl', ['$scope', '$state', '$stateParams', '$timeout', function($scope, $state, $stateParams, $timeout){
	console.log('working');
	console.log($stateParams);
	$scope.projectId = $stateParams.projectId;
	$scope.cityId = $stateParams.cityId;
	$scope.project = {};
	$scope.editableVersion = '';
	$scope.forms = [
		{id: 'project-basic-details', name: 'Project Basic Details'},
		{id: 'sports-n-clubhouse', name: 'Sports And Clubhouse Details'},
		{id: 'home-delivery', name: 'Home Delivery'},
		{id: 'society-shops', name: 'Society Shops'},
		{id: 'costing-details', name: 'Costing Details'},
		{id: 'rwa-details', name: 'RWA Details'},
		{id: 'security-details', name: 'Security Details'},
		{id: 'connectivity-details', name: 'Connectivity Details'},
		{id: 'units', name: 'Units'},
		{id: 'other-details', name: 'Other Details'},
		{id: 'ranking-rating', name: 'Ranking Rating And Area'}
	];

	getProjectEditable();

	function getProjectEditable() {
		console.log($scope.projectId);
		console.log('protectedResidentialVersions/'+$scope.cityId+'/projects/'+$scope.projectId);
		var newData = firebase.database().ref('protectedResidentialVersions/'+$scope.cityId+'/projects/'+$scope.projectId+'/editable');
	    newData.on('value', function(data) {
	    	console.log(data.val().version);
	    	$scope.editableVersion = data.val().version;
	    });
    };


	$scope.goToForm = function(val){
		var projectRequiredDetail = {};
		projectRequiredDetail.version = $scope.editableVersion;
		projectRequiredDetail.projectId = $scope.projectId;
		projectRequiredDetail.cityId = $scope.cityId;
		window.localStorage['projectRequiredDetail'] = JSON.stringify(projectRequiredDetail);
		console.log(window.localStorage['projectRequiredDetail']);
		$state.go(val);
	}
}]);