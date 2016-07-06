app.controller('HomeDeliveryCtrl', ['$scope', '$ionicPopover', '$timeout', '$state', function($scope,$ionicPopover,$timeout, $state){
	var projectRequiredDetail = JSON.parse(window.localStorage['projectRequiredDetail']);
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;

	$scope.formName = 'home-delivery';
	$scope.homeDelivery = {
		restaurant: [],
		grocery: [],
		pharmacy: [],
		parlour: [],
		cableProvider: [],
		isp: [],
		milkman: [],
		newspaperDelivery: [],
		laundry: []
	};
	$scope.homeDeliveryDetails = {};

	$scope.vendors = [];

	$scope.vendorsCount = 0;
	$scope.vendorType = '';

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/homeDelivery').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	angular.forEach(snapshot.val(), function(value, key){
            		console.log(value, key);
            		var hdoption = {};
            		angular.forEach(value, function(value1, key1){
            			hdoption.type = key;
            			hdoption.name = value1.name;
            			hdoption.contact = value1.contact;
            			$scope.vendors.push(hdoption);
            			$scope.vendorsCount++;
            		})
            	})
            }  
         });
    };

	$scope.selectShop = function(value){
		$scope.vendorType = value;
		console.log($scope.vendorType);
	}

	$scope.addShop = function(){
		var addProjectDetails = {};
		console.log($scope.homeDeliveryDetails);
		if($scope.homeDeliveryDetails.name != undefined && $scope.homeDeliveryDetails.name != '' && $scope.homeDeliveryDetails.contact != undefined && $scope.homeDeliveryDetails.contact != '' && $scope.vendorType != ''){
			var newKey = db.ref("protectedResidential/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/homeDelivery/"+$scope.vendorType).push().key;
			addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/homeDelivery/"+$scope.vendorType+'/'+newKey] = $scope.homeDeliveryDetails;
	 		db.ref().update(addProjectDetails);
	 		console.log(addProjectDetails);
	 		$scope.homeDeliveryDetails.type = $scope.vendorType;
	 		$scope.vendors.push($scope.homeDeliveryDetails);
	 		$scope.vendorsCount++;
	 		$scope.homeDeliveryDetails = {};
		}
	}


	$scope.homeDelivery = function(){
		console.log($scope.project);
		$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('units');
      	},2000);
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