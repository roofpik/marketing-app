app.controller('SocietyShopsCtrl', ['$scope', '$ionicPopover', '$timeout', '$state', '$ionicPopup', function($scope,$ionicPopover,$timeout, $state, $ionicPopup){
	$scope.formName = 'society-shops';

	var projectRequiredDetail = JSON.parse(window.localStorage['projectRequiredDetail']);
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;

	$scope.societyShops = {
		grocery: [],
		pharmacy: [],
		parlour: []
	};
	$scope.shopDetails = {};

	$scope.shops = [];

	$scope.shopsCount = 0;
	$scope.shopType = '';

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref('protectedResidential/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/societyShops').once('value', function(snapshot) {
            console.log(snapshot.val());
            if(snapshot.val() != null){
            	angular.forEach(snapshot.val(), function(value, key){
            		console.log(value, key);
            		var shopOption = {};
            		angular.forEach(value, function(value1, key1){
            			shopOption.type = key;
            			shopOption.name = value1.name;
            			shopOption.contact = value1.contact;
            			$scope.shops.push(shopOption);
	 					$scope.shopsCount++;
            		})
            	})
            }  
         });
    };

	$scope.selectShop = function(value){
		$scope.shopType = value;
		console.log($scope.shopType);
	}

	$scope.addShop = function(){
		var addProjectDetails = {};
		console.log($scope.shopDetails);
		if($scope.shopDetails.name != undefined && $scope.shopDetails.name != '' && $scope.shopDetails.contact != undefined && $scope.shopDetails.contact != '' && $scope.shopType != ''){
			var newKey = db.ref("protectedResidential/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/societyShops/"+$scope.shopType).push().key;
			addProjectDetails["protectedResidential/"+$scope.cityId+"/projects/"+$scope.projectId+'/'+$scope.editableVersion+"/societyShops/"+$scope.shopType+'/'+newKey] = $scope.shopDetails;
	 		db.ref().update(addProjectDetails);
	 		console.log(addProjectDetails);
	 		$scope.shopDetails.type = $scope.shopType;
	 		$scope.shops.push($scope.shopDetails);
	 		$scope.shopsCount++;
	 		$scope.shopDetails = {};
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

	$scope.save = function(){
		console.log(addProjectDetails);
		//db.ref().update(addProjectDetails);
      	$timeout(function(){
      		window.localStorage['project'] = JSON.stringify($scope.project);
      		$state.go('home-delivery');
      	},2000);
	}

}]);