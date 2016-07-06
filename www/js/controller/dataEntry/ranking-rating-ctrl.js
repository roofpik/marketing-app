app.controller('RankingRatingCtrl', ['$scope', '$state', '$timeout', '$ionicPopover', function($scope, $state, $timeout, $ionicPopover){
	var projectRequiredDetail = JSON.parse(window.localStorage['projectRequiredDetail']);
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
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
    	console.log('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/ratings').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.ratings = snapshot.val();
            	console.log($scope.ratings);
            }  
         });
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/ranking').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.ranking = snapshot.val();
            	console.log($scope.ranking);
            }  
         });
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/priceRange').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.priceRange = snapshot.val();
            	console.log($scope.priceRange);
            }  
         });
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/areas').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.areas = snapshot.val();
            	console.log($scope.areas);
            }  
         });
    };

	$scope.save = function(){
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+"/"+$scope.editableVersion+ "/ratings"] = $scope.ratings;
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+"/"+$scope.editableVersion+ "/ranking"] = $scope.ranking;
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+"/"+$scope.editableVersion+ "/priceRange"] = $scope.priceRange;
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+"/"+$scope.editableVersion+ "/areas"] = $scope.areas;
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

}]);