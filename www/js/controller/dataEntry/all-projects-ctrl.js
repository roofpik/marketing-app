app.controller('AllProjectsCtrl', ['$scope','$state', '$timeout', '$ionicLoading', function($scope, $state, $timeout, $ionicLoading){
	$scope.myId = window.localStorage.getItem('uid');
	$scope.projects = [];
	$scope.cities = [];
	$scope.selected = {};
	$scope.city ={};
	$ionicLoading.show({
	    template: 'Loading...'
	  }); 

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
	        	$ionicLoading.hide();
	        }, 50);   
		});
	}

	$scope.selectCity = function(){
		console.log(JSON.parse($scope.selected.selectedCity));
		$scope.city = JSON.parse($scope.selected.selectedCity);
		$ionicLoading.show({
		    template: 'Loading...'
		  }); 
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
				$ionicLoading.hide();
			},0);
			
		});
	}

	$scope.getProjectDetails = function(selectedProject){
		console.log(selectedProject);
		$state.go('all-forms', {projectId: selectedProject.projectId, cityId:$scope.city.cityId});
	}
}]);