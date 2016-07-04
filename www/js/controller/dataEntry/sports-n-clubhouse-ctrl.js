app.controller('SportsNClubhouseCtrl',['$scope', '$timeout', '$state', '$ionicPopover', function($scope,$timeout, $state, $ionicPopover){
	$scope.project=JSON.parse(window.localStorage['project']);
	$scope.formName = 'sports-n-clubhouse';
	$scope.sportsActivities = {};
	$scope.clubHouse = {
		operatingTimes: {
			start: '',
			end: '',
			holiday: {

			}
		}
	};

	$scope.city="Gurgaon";
	$scope.location= "MG Road";
	$scope.selectSports = function(val){
		console.log(val);
		if($scope.sportsActivities[val] == undefined) {
			$scope.sportsActivities[val] = true;
		} else {
			$scope.sportsActivities[val] = !$scope.sportsActivities[val];
			if($scope.sportsActivities[val] == false){
				delete $scope.sportsActivities[val];
			}
		}
		console.log($scope.sportsActivities);
	}

	$scope.selectClubActivity = function(val){
		console.log(val);
		if($scope.clubHouse[val] == undefined) {
			$scope.clubHouse[val] = true;
		} else {
			$scope.clubHouse[val] = !$scope.clubHouse[val];
			if($scope.clubHouse[val] == false){
				delete $scope.clubHouse[val];
			}
		}
		console.log($scope.clubHouse);
	}

	$scope.day = {};

	$scope.save = function(){
		//console.log($scope.day);
		if($scope.day.monday == true){
			$scope.clubHouse.operatingTimes.holiday.monday = true;
		}
		if($scope.day.tuesday == true){
			$scope.clubHouse.operatingTimes.holiday.tuesday = true;
		}
		if($scope.day.wednesday == true){
			$scope.clubHouse.operatingTimes.holiday.wednesday = true;
		}
		if($scope.day.thursday == true){
			$scope.clubHouse.operatingTimes.holiday.thursday = true;
		}
		if($scope.day.friday == true){
			$scope.clubHouse.operatingTimes.holiday.friday = true;
		}
		if($scope.day.saturday == true){
			$scope.clubHouse.operatingTimes.holiday.saturday = true;
		}
		if($scope.day.sunday == true){
			$scope.clubHouse.operatingTimes.holiday.sunday = true;
		}
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/sportsActivities"] = $scope.sportsActivities;
      	addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + $scope.project.projectId+'/'+$scope.project.version+ "/clubHouse"] = $scope.clubHouse;

      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$scope.project.sportsActivities = $scope.sportsActivities;
      	$scope.project.clubHouse = $scope.clubHouse;
      	$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('rwa-details');
      	},2000);
		//console.log($scope.clubHouse.operatingTimes.holiday);
		
	}

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

}]);