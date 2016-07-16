app.controller('TagsCtrl', ['$scope', '$ionicPopover', '$state', '$ionicLoading','$firebaseArray', function($scope, $ionicPopover, $state, $ionicLoading, $firebaseArray){
	console.log('tags');
	$ionicLoading.show({
	    template: 'Loading...'
	  });
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
    $scope.projectType = projectRequiredDetail.projectType;

	$scope.formName ='tags';
	$scope.hideTags = true;

	$scope.tags = {};

	getProjectDetails();

    function getProjectDetails(){
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/tags').on('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	$scope.tags = {};
            	$scope.tags = snapshot.val();
            	console.log($scope.tags);
            }
            // $ionicLoading.hide(); 
            getTags();
         });
    };

    function getTags(){
    	console.log('called');
    	var tagRef = db.ref('tags/');
    	console.log($firebaseArray(tagRef));
    	$scope.availableTags = $firebaseArray(tagRef);
    	$ionicLoading.hide(); 
    }
    $scope.tag = {};

    $scope.showTags  = function(){
    	console.log($scope.tag.query);
    	if($scope.tag.query.length > 1){
    		$scope.hideTags = false;
    	} else {
    		$scope.hideTags = true;
    	}
    }

    $scope.addTag = function(thisTag){
    	console.log(thisTag);
	 	var updates = {};
	    updates[$scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/tags/'+thisTag.tagId+'/tagId'] = thisTag.tagId;
	    updates[$scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/tags/'+thisTag.tagId+'/tagName'] = thisTag.tagName;
	    console.log(updates);
	    firebase.database().ref().update(updates).then(function(){
	    	$scope.tags[thisTag.tagId] = {
	    		tagId: thisTag.tagId,
	    		tagName: thisTag.tagName
	    	}
	    });
    }

    $scope.removeTag = function(thisTag){
    	console.log(thisTag);
    	db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/tags/'+thisTag.tagId).remove();
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