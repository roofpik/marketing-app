app.controller('AddTaskCtrl', ['$ionicHistory', '$scope', '$timeout', '$ionicPopup', '$state', '$ionicPopover', '$filter', 
	function($ionicHistory, $scope, $timeout,$ionicPopup, $state, $ionicPopover,$filter){

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
	        }, 50);
		});
	};

	$scope.selectCity=function(cityDetails){

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
	    updates['/activity/' + $scope.myId  + '/' + dates + '/' + newPostKey + '/type'] = "DataEntry";
	    $scope.data.active=true;
        updates['/activity/' + $scope.myId  + '/' + dates + '/' + newPostKey + '/planning'] = $scope.data;
	    console.log($scope.data);

	    firebase.database().ref().update(updates);
	  
	 };

	 $scope.myGoBack = function() {
	    $ionicHistory.goBack();
	  };

}]);