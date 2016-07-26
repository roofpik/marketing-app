app.controller('ImportantContactsCtrl',['$scope', '$timeout', '$state', '$ionicPopover', '$ionicPopup','$ionicLoading', function($scope, $timeout, $state, $ionicPopover, $ionicPopup, $ionicLoading){
	$ionicLoading.show({
	    template: 'Loading...'
	  });
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;
	$scope.formName = 'important-contacts';
	$scope.importantContacts = {
		rwa:{},
		maintenanceOffice: {}
	};

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/importantContacts').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	if(snapshot.val().rwa != null){
            		$scope.importantContacts.rwa = snapshot.val().rwa;
            		if($scope.importantContacts.rwa.holdMarketingCamp != undefined){
            			if($scope.importantContacts.rwa.holdMarketingCamp){
            				$scope.marketingTrue = true;
            			} else {
            				$scope.marketingFalse = true;
            			}
            		}
            		console.log($scope.importantContacts);	
            	} if(snapshot.val().maintenanceOffice != null){
            		$scope.importantContacts.maintenanceOffice = snapshot.val().maintenanceOffice;
            		console.log($scope.importantContacts);
            	}
            } 
            $ionicLoading.hide(); 
         });
    };

    $scope.marketingTrue;
    $scope.marketingFalse;

    $scope.selectMarketingCamp = function(val){
    	if(val == 1){
    		$scope.marketingTrue = !$scope.marketingTrue;
    		if(!$scope.marketingTrue){
    			delete $scope.importantContacts.rwa.holdMarketingCamp;
    			delete $scope.marketingTrue;
    		} else {
    			$scope.importantContacts.rwa.holdMarketingCamp = true;
    			delete $scope.marketingFalse;
    		}
    	} else if(val == 2){
    		$scope.marketingFalse = !$scope.marketingFalse;
    		if(!$scope.marketingFalse){
    			delete $scope.importantContacts.rwa.holdMarketingCamp;
    			delete $scope.marketingFalse;
    		} else {
    			$scope.importantContacts.rwa.holdMarketingCamp = false;
    			delete $scope.importantContacts.rwa.campCharges;
    			delete $scope.marketingTrue;
    		}
    	}
    }

	$scope.save = function(value){
		console.log(value);
		console.log($scope.importantContacts[value]);
		if($scope.importantContacts[value] != null){
			var addProjectDetails = {};
	      	addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/" + $scope.projectId+'/'+$scope.editableVersion+ "/importantContacts/"+value] = $scope.importantContacts[value];
	      	console.log(addProjectDetails);
	      	db.ref().update(addProjectDetails).then(function(){
                $ionicPopup.alert({
                    title:'Updated Successfully',
                    template: 'Details updated successfully'
                }).then(function(){
                    $scope.importantContacts = {
                        rwa:{},
                        maintenanceOffice: {}
                    };
                    window.location.reload(true);
                })
	      	});	
	    } else{
	    	$ionicPopup.alert({
				title: 'Empty Fields',
				template: 'Please enter the details'
			})
	    } 	
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

    $scope.next = function(){
    	$state.go('near-me');
    }

}]);