app.controller('AllProjectsCtrl', ['$scope','$state', '$timeout', function($scope, $state, $timeout){
	$scope.myId = window.localStorage.getItem('uid');
	$scope.projects = [];
	$scope.cities = [];
	$scope.selected = {};
	$scope.city ={};

	getCities();

	function getCities() {
		var cityData = firebase.database().ref('city');
	    cityData.on('value', function(data) {
	        console.log(data.val());
	        $timeout(function(){
	        	angular.forEach(data.val(), function(value, key){
	        		$scope.cities.push(value);
	        	//$timeout(function(){console.log($scope.cities);},50);
	        	})
	        }, 50);   
		});
	}

	$scope.selectCity = function(){
		console.log(JSON.parse($scope.selected.selectedCity));
		$scope.city = JSON.parse($scope.selected.selectedCity);
		$scope.getAllProjects();
	}

	$scope.getAllProjects = function(){
		db.ref('admins/'+$scope.myId+'/projectAccess/'+$scope.city.cityId).once('value', function(snapshot){
			console.log(snapshot.val());
			$timeout(function(){
				angular.forEach(snapshot.val().projects, function(val, key){
					$scope.projects.push(val);
				});
				console.log($scope.projects);
			},0);
			
		});
	}

	$scope.getProjectDetails = function(selectedProject){
		console.log(selectedProject);
		$state.go('all-forms', {projectId: selectedProject.projectId, cityId:$scope.city.cityId});
	}
}]);