app.controller('NearMeCtrl', ['$scope', '$ionicPopover', '$timeout', '$state', '$ionicLoading', '$ionicPopup', function($scope,$ionicPopover,$timeout, $state, $ionicLoading, $ionicPopup){
	$ionicLoading.show({
	    template: 'Loading...'
	  });
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;

	$scope.formName = 'near-me';
	// $scope.homeDelivery = {
	// 	restaurant: [],
	// 	grocery: [],
	// 	pharmacy: [],
	// 	parlour: [],
	// 	cableProvider: [],
	// 	isp: [],
	// 	milkman: [],
	// 	newspaperDelivery: [],
	// 	laundry: []
	// };
	$scope.nearMeDetails = {};

	$scope.vendors = [];

	$scope.vendorsCount = 0;
	$scope.vendorType = '';
	$scope.selectedType ={type:''};

	$scope.nearMeTypes = [
		{id: 'grocery', name: 'Grocery'},
		{id: 'cableProvider', name: 'Cable Provider'},
		{id: 'pharmacy', name: 'Pharmacy'},
		{id: 'isp', name: 'ISP'},
		{id: 'milkman', name: 'Milkman'},
		{id: 'newspaperDelivery', name: 'Newspaper Delivery'},
		{id: 'laundry', name: 'Laundry'},
		{id: 'dth', name: 'DTH'}
	];

	$scope.availableOptions = [];

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/nearMe').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	angular.forEach(snapshot.val(), function(value,key){
	            	value.name=key;
	            	$scope.availableOptions.push(value);
	            })	
            }
            
            // if(snapshot.val() != null){
            // 	angular.forEach(snapshot.val(), function(value, key){
            // 		console.log(value, key);
            // 		var hdoption = {};
            // 		angular.forEach(value, function(value1, key1){
            // 			hdoption.type = key;
            // 			hdoption.name = value1.name;
            // 			hdoption.contact = value1.contact;
            // 			$scope.vendors.push(hdoption);
            // 			$scope.vendorsCount++;
            // 		})
            // 	})
            // } 
         }).then(function(){
         	$ionicLoading.hide();
         });
    };

	$scope.selectType = function(){
		console.log($scope.selectedType.type);
		$scope.vendorType = JSON.parse($scope.selectedType.type).id;
		console.log($scope.vendorType);
	}

	$scope.addShop = function(){
		var addProjectDetails = {};
		$ionicLoading.show({
		    template: 'Loading...'
		  });
		console.log($scope.nearMeDetails);
		if($scope.nearMeDetails.name != undefined && $scope.nearMeDetails.name != '' && $scope.nearMeDetails.contact != undefined && $scope.nearMeDetails.contact != '' && $scope.vendorType != ''){
			var exists = false;
			angular.forEach($scope.availableOptions, function(value,key){
				console.log(value.name);
				if($scope.vendorType == value.name){
					angular.forEach(value.contacts, function(value1, key1){
						console.log(value1);
						if(value1.contact == $scope.nearMeDetails.contact){
							console.log('exists');
							exists = true;
						}
					})
				}
			});
			if(exists){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Already Added'
				})
			} else {
				var newKey = db.ref($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/nearMe/"+$scope.vendorType+'/contacts').push().key;
				addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/nearMe/"+$scope.vendorType+'/'+$scope.vendorType] = true;
				addProjectDetails[$scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/nearMe/"+$scope.vendorType+'/contacts/'+newKey] = $scope.nearMeDetails;
		 		db.ref().update(addProjectDetails).then(function(){
		 			console.log(addProjectDetails);
			 		$scope.nearMeDetails.type = $scope.vendorType;
			 		$scope.vendors.push($scope.nearMeDetails);
			 		$scope.vendorsCount++;
			 		$scope.nearMeDetails = {};
			 		$ionicLoading.hide();
		 			$ionicPopup.alert({
						title:'Added Successfully',
						template: 'Details successfully updated'
					}).then(function(){
						window.location.reload(true);
					})
		 		});
			}
		} else if($scope.vendorType != ''){
			$ionicLoading.hide();
			db.ref($scope.projectType+"/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/nearMe/"+$scope.vendorType+'/'+$scope.vendorType).set(true).then(function(){
				$ionicPopup.alert({
					title:'Added Successfully',
					template: 'Details successfully updated'
				}).then(function(){
					window.location.reload(true);
				})
			});
		} else {
			$ionicLoading.hide();
			$ionicPopup.alert({
				title:'Empty Fields',
				template: 'Please fill the empty fields'
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
        $state.go('all-forms');
    }

    $scope.next = function(){
    	$state.go('connectivity-details');
    }

}]);