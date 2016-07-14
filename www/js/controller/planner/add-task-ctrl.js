app.controller('AddTaskCtrl', ['$scope', '$timeout', '$ionicPopup', '$state', '$ionicPopover', '$filter', '$ionicLoading', 
	function($scope, $timeout,$ionicPopup, $state, $ionicPopover,$filter, $ionicLoading){
	$ionicLoading.show({
	    template: 'Loading...'
	  });
	$scope.myId = localStorage.getItem("uid");

	console.log($scope.myId);
	$scope.projects=[];
	$scope.cities = [];

    $scope.data={
    	start:{},
    	end:{}
    };

    $scope.citySelected = false;

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
	};

	$scope.selectCity=function(cityDetails){
		$ionicLoading.show({
		    template: 'Loading...'
		  });
		$scope.citySelected = true;
	 	console.log(cityDetails);
	 	cityDetails=JSON.parse(cityDetails);	
	 	$scope.data.cityId=cityDetails.cityId;
	 	$scope.data.cityName=cityDetails.cityName;
	 	getProjects();
	 };


	function getProjects(){
		console.log('called');
		console.log($scope.myId);
		console.log($scope.data.cityId);
		var newData = firebase.database().ref('admins/'+$scope.myId+'/projectAccess/'+$scope.data.cityId+'/projects');
	    newData.on('value', function(data) {
	    	console.log(data.val());
	    	$timeout(function(){
	        	angular.forEach(data.val(), function(value, key){
	        		$scope.projects.push(value);
	        	});
	        	console.log($scope.projects);
	        	$ionicLoading.hide();
	        }, 50);
	    	//$scope.editableVersion = data.val().version;
	    });
	};

	$scope.selectProject=function(projectDetails){
	 	console.log(projectDetails);
	 	projectDetails=JSON.parse(projectDetails);	
	 	$scope.data.projectId=projectDetails.projectId;
	 	$scope.data.projectName=projectDetails.projectName;
	 };
	 
	$scope.date=new Date();
    var dates = $filter('date')($scope.date, 'dd-MM-yy');
	  
	console.log(dates);

	 $scope.addTask=function(){

	 	console.log($scope.data);
	 	var newPostKey = firebase.database().ref('/activity/'+$scope.myId).child(dates).push().key;
	 	var updates = {};
	    updates['/activity/' + $scope.myId  + '/' + dates + '/' + newPostKey + '/type'] = "Data Entry";
	    $scope.data.active=true;
        updates['/activity/' + $scope.myId  + '/' + dates + '/' + newPostKey + '/planning'] = $scope.data;
	    console.log($scope.data);

	    firebase.database().ref().update(updates).then(function(){
	    	$state.go('tasks', {adminId:$scope.myId});
	    });
	  
	 };

	 $scope.goBack = function() {
	 	console.log('called');
	    $state.go('welcome', {adminId: $scope.myId});
	  };

}]);