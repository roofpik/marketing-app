app.controller('RwaDetailsCtrl',['$scope', '$timeout', '$state', '$ionicPopover', '$ionicPopup', function($scope, $timeout, $state, $ionicPopover, $ionicPopup){
	var projectRequiredDetail = JSON.parse(window.localStorage['projectRequiredDetail']);
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.formName = 'rwa-details';
	$scope.rwa = {};

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/rwa').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.rwa = snapshot.val();
            	console.log($scope.rwa);
            }  
         });
    };

	$scope.save = function(){
		
		var addProjectDetails = {};
      	addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/rwa"] = $scope.rwa;
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