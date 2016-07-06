app.controller('SportsNClubhouseCtrl',['$scope', '$timeout', '$state', '$ionicPopover', function($scope,$timeout, $state, $ionicPopover){
	var projectRequiredDetail = JSON.parse(window.localStorage['projectRequiredDetail']);
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;

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
	getProjectDetails();

    function getProjectDetails(){
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/sportsActivities').once('value', function(snapshot) {
            //console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.sportsActivities = snapshot.val();
            	console.log($scope.sportsActivities);
            }  
         });

        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/clubHouse').once('value', function(snapshot) {
            //console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.clubHouse = snapshot.val();
            	console.log($scope.clubHouse);
            	angular.forEach(snapshot.val().operatingTimes.holiday, function(value, key){
            		console.log(value, key);
            		if(value == true){
            			$scope.day[key] = true;
            		}
            	})
            }  
         });
    };

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
	$scope.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	$scope.save = function(){
		console.log($scope.day);
		angular.forEach($scope.days, function(value, key){
			if($scope.day[value] == true){
				console.log(value, $scope.day[value]);
				$scope.clubHouse.operatingTimes.holiday[value] = true;
			} else {
				delete $scope.clubHouse.operatingTimes.holiday[value];
			}
		})
		 console.log($scope.clubHouse.operatingTimes.holiday);
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/sportsActivities"] = $scope.sportsActivities;
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/clubHouse"] = $scope.clubHouse;

      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
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