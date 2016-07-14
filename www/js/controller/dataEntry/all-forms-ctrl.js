app.controller('AllFormsCtrl', ['$scope', '$state', '$stateParams', '$timeout', function($scope, $state, $stateParams, $timeout){
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

	$scope.goToForm = function(val){
		$state.go(val);
	}

	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	console.log(projectRequiredDetail);

	$scope.goToActivity = function(){
		$state.go('data-entry', {activityId:projectRequiredDetail.activityId});
	}
}]);