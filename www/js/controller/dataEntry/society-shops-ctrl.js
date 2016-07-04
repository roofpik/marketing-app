app.controller('SocietyShopsCtrl', ['$scope', '$ionicPopover', '$timeout', '$state', function($scope,$ionicPopover,$timeout, $state){
	$scope.formName = 'society-shops';
	$scope.project = JSON.parse(window.localStorage['project'] || {});
	console.log($scope.project);
	$scope.societyShops = {
		grocery: [],
		pharmacy: [],
		parlour: []
	};
	$scope.shopDetails = {};

	$scope.shops = [];

	$scope.shopsCount = 0;
	$scope.shopType = '';

	$scope.selectShop = function(value){
		$scope.shopType = value;
		console.log($scope.shopType);
	}

	$scope.addShop = function(){
		var addProjectDetails = {};
		console.log($scope.shopDetails);
		if($scope.shopDetails.name != undefined && $scope.shopDetails.name != '' && $scope.shopDetails.contact != undefined && $scope.shopDetails.contact != '' && $scope.shopType != ''){
			var newKey = db.ref("protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/"+$scope.project.projectId+'/'+$scope.project.version+"/societyShops/"+$scope.shopType).push().key;
			addProjectDetails["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/"+$scope.project.projectId+'/'+$scope.project.version+"/societyShops/"+$scope.shopType+'/'+newKey] = $scope.shopDetails;
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