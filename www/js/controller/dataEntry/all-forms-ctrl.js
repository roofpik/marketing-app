app.controller('AllFormsCtrl', ['$scope', '$state', '$stateParams', '$timeout', function($scope, $state, $stateParams, $timeout){
	$scope.forms = [
		{id: 'project-basic-details', name: 'Project Details'},
		{id: 'add-project-locations', name: 'Add Locations'},
		{id: 'standout-features', name: 'Standout Features'},
		{id: 'specifications', name: 'Specifications'},
		{id: 'other-details', name: 'Other Specifications'},
		{id: 'configurations', name: 'Configurations'},
		{id: 'sports-n-clubhouse', name: 'Sports And Clubhouse Details'},
		{id: 'security-details', name: 'Security Details'},
		{id: 'important-contacts', name: 'Important Contacts'},
		{id: 'costing-details', name: 'Costing Details'},
		{id: 'near-me', name: 'Services within the community'},
		{id:'connectivity-details', name: 'Connectivity'}
		// {id: 'society-shops', name: 'Society Shops'},
		// {id: 'connectivity-details', name: 'Connectivity Details'},
		// {id: 'ranking-rating', name: 'Ranking Rating And Area'},
		
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