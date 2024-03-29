app.controller('RankingRatingCtrl', ['$scope', '$state', '$timeout', '$ionicPopover', '$ionicLoading', function($scope, $state, $timeout, $ionicPopover, $ionicLoading){
	$ionicLoading.show({
      template: 'Loading...'
    });
  var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
  $scope.projectType = projectRequiredDetail.projectType;
	$scope.formName ='ranking-rating';

	$scope.ratings = {};
	$scope.ranking = {};
	$scope.priceRange = {
		buy: {},
		rent: {}
	};
	$scope.areas = {};
	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/ratings').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.ratings = snapshot.val();
            	console.log($scope.ratings);
            }  
         });
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/ranking').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.ranking = snapshot.val();
            	console.log($scope.ranking);
            }  
         });
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/priceRange').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.priceRange = snapshot.val();
            	console.log($scope.priceRange);
            }  
         });
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/areas').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.areas = snapshot.val();
            	console.log($scope.areas);
            }  
         });
        $timeout(function() {
          $ionicLoading.hide();
        }, 1000);
    };

	$scope.save = function(){
		var addProjectDetails = {};
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+"/"+$scope.editableVersion+ "/ratings"] = $scope.ratings;
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+"/"+$scope.editableVersion+ "/ranking"] = $scope.ranking;
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+"/"+$scope.editableVersion+ "/priceRange"] = $scope.priceRange;
      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+"/"+$scope.editableVersion+ "/areas"] = $scope.areas;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$scope.ratings = {};
		$scope.ranking = {};
		$scope.priceRange = {
			buy: {},
			rent: {}
		};
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

  $scope.goBack = function(){
        console.log('called');
        $state.go('data-entry', {activityId:projectRequiredDetail.activityId});
    }

}]);