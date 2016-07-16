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

	$scope.adminProjectType = '';

	$scope.selectProjectType = function(value) {
		$scope.data.projectType = value;
		console.log(value);
		if(value == 'protectedResidential'){
			$scope.adminProjectType = 'residential';
		} else {
			$scope.adminProjectType = 'pg';
		}
	}

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
		var newData = firebase.database().ref('admins/'+$scope.myId+'/projectAccess/'+$scope.data.cityId+'/'+$scope.adminProjectType);
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
	 	if($scope.data.cityId != undefined && $scope.data.projectId != undefined && $scope.data.start.time != undefined && $scope.data.end.time != undefined &&$scope.data.projectType != undefined){
		 	var newPostKey = firebase.database().ref('/activity/'+$scope.myId).child(dates).push().key;
		 	var updates = {};
		    updates['/activity/' + $scope.myId  + '/' + dates + '/' + newPostKey + '/type'] = "Data Entry";
		    $scope.data.active=true;
	        updates['/activity/' + $scope.myId  + '/' + dates + '/' + newPostKey + '/planning'] = $scope.data;
		    console.log($scope.data);

		    firebase.database().ref().update(updates).then(function(){
		    	$state.go('tasks', {adminId:$scope.myId});
		    });
	 	} else {
	 		$ionicPopup.alert({
	 			title:'Data missing',
	 			template: 'Please fill all the information'
	 		});
	 	}
	 	console.log($scope.data);
	 };

	$scope.goBack = function() {
	 	console.log('called');
	    $state.go('welcome', {adminId: $scope.myId});
	};

	$scope.timePickerObject = {
		inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
		step: 5,  //Optional
		format: 24,  //Optional
		titleLabel: 'Start Time',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-assertive',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallback(val);
		}
	};

	$scope.showTime = "";
	function timePickerCallback(val) {
		console.log(val);
		if(val != undefined){
			$scope.showTime = convertTime(val);
			var currentDate = new Date().getFullYear() +'-'+new Date().getMonth()+'-'+new Date().getDate();
			console.log(currentDate);
			var currentTime = $scope.showTime+':00:000';
			console.log(currentTime);
			$scope.data.start.time = moment(currentDate+ ' '+ currentTime).valueOf();
			console.log($scope.data.start.time);
		}
		console.log($scope.showTime);
	}
	$scope.timePickerObject1 = {
		inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
		step: 5,  //Optional
		format: 24,  //Optional
		titleLabel: 'Start Time',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-assertive',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallback1(val);
		}
	};


	$scope.showTime1 = "";
	function timePickerCallback1(val) {
		//console.log(val);
		if(val != undefined){
			$scope.showTime1 = convertTime(val);
			var currentDate = new Date().getFullYear() +'-'+new Date().getMonth()+'-'+new Date().getDate();
			console.log(currentDate);
			var currentTime = $scope.showTime1+':00:000';
			console.log(currentTime);
			$scope.data.end.time = moment(currentDate+ ' '+ currentTime).valueOf();
			console.log($scope.data.end.time);
		}
		console.log($scope.showTime1);
	}

	function convertTime(sTime){
		return (moment().startOf('day')
        .seconds(sTime)
        .format('H:mm'));

	}


}]);