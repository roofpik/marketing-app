app.controller('SpecificationsCtrl', ['$scope', '$timeout', '$state', '$ionicLoading', '$ionicPopover', '$ionicPopup', function($scope, $timeout, $state, $ionicLoading, $ionicPopover, $ionicPopup){
	$ionicLoading.show({
	    template: 'Loading...'
	  });

	$timeout(function(){
		$ionicLoading.hide();
	},8000);
	var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));
	$scope.projectId = projectRequiredDetail.projectId;
	$scope.cityId = projectRequiredDetail.cityId;
	$scope.editableVersion = projectRequiredDetail.version;
	$scope.projectType = projectRequiredDetail.projectType;

	$scope.specifications = {};

	getProjectDetails();

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/units/specifications').once('value', function(snapshot) {
            if(snapshot.val() != null){
            	$scope.specifications = snapshot.val();
            	console.log($scope.specifications);
            }
            $timeout(function(){
            	$ionicLoading.hide(); 
            }, 500);
            
         });
    };

	$scope.specifications1 = [
		{name: 'Home Automation', id: 'homeAutomation'},
		{name: 'Kitchen Appliances', id: 'kitchenAppliances'},
		{name: 'Kitchen OTG', id: 'kitchenOTG'},
		{name: 'Kitchen Modular', id: 'kitchenModular'},
		{name: 'Kitchen Dishwasher', id: 'kitchenDishwasher'},
		{name: 'Kitchen Chimney', id: 'kitchenChimney'},
		{name: 'Kitchen Microwave Oven', id: 'kitchenMicrowaveOven'},
		{name: 'Kitchen Refrigerator', id: 'kitchenRefrigerator'},
		{name: 'Kitchen Hob', id: 'kitchenHob'},
		{name: 'Fully Furnished', id: 'fullyFurnished'},
		{name: 'Wardrobes', id: 'wardrobes'},
	];

	$scope.specifications2 = [
		{name: 'Shower Cubicle', id: 'showerCubicle'},
		{name: 'Jacuzzi', id: 'jacuzzi'},
		{name: 'Bathtub', id: 'bathTub'}
	];

	$scope.specifications3 = [
		{name: 'Master Bedroom', id: 'flooringMasterBedroom'},
		{name: 'Living Dining', id: 'flooringLivingDining'},
		{name: 'Other Bedrooms', id: 'flooringOtherBedrooms'}
	];
	$scope.flooring = {
	}

	$scope.flooringTypes = [
		{id: 'italianMarble', name: 'Italian Marble'},
		{id: 'importedMarble', name: 'Imported Marble'},
		{id: 'vitrifiedTiles', name: 'Vitrified Tiles'},
		{id: 'laminatedWoodenFlooring', name: 'Laminated Wooden Flooring'},
		{id: 'hardwoodFlooring', name: 'Hardwood Flooring'},
		{id: 'marbleFlooring', name: 'Marble Flooring'},
		{id: 'naturalStone', name: 'Natural Stone'},
		{id: 'other', name: 'Other'}
	];

	$scope.selectSpec = function(specification){
		specification.selected = !specification.selected;
		if(!specification.selected){
			delete $scope.specifications[specification.id];
		}
	}

	$scope.chooseSpecValue = function(specification, value){
		console.log(specification, value);
		$scope.specifications[specification.id] = value;
		console.log($scope.specifications[specification.id]);
	}

	$scope.selectFlooring = function(value){
		//console.log(value);
		//console.log($scope.flooring[value.id].type);
		$scope.specifications[value.id] = JSON.parse($scope.flooring[value.id].type).name;
		console.log($scope.specifications[value.id]);
	}

	$scope.selectSpecification = function(val){
		console.log(val);
		if($scope.specifications[val] == undefined) {
			$scope.specifications[val] = true;
		} else {
			$scope.specifications[val] = !$scope.specifications[val];
			if($scope.specifications[val] == false){
				delete $scope.specifications[val];
			}
		}
	}

	$scope.airConditioning = {};

	$scope.selectAc = function(){
		if($scope.airConditioning.selected == undefined) {
			$scope.airConditioning.selected = true;
		} else {
			$scope.airConditioning.selected = !$scope.airConditioning.selected;
			if($scope.airConditioning.selected == false){
				delete $scope.specifications.airConditioning;
			}
		}
		console.log($scope.airConditioning.selected);
	}

	$scope.selectAcType = function(val){
		$scope.specifications.airConditioning = val;
	}

	$scope.save = function(){
		console.log($scope.specifications);
		$ionicLoading.show({
		    template: 'Loading...'
		 });
		var updates = {};
		updates[$scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/units/specifications'] = $scope.specifications;
		db.ref().update(updates).then(function(){
			$ionicLoading.hide();
      		$ionicPopup.alert({
				title: 'Successful',
				template: 'Project Details updates successfully'
			}).then(function(){
				$state.go('other-details');
			})
			$scope.specifications = {};
		})
	}

	$scope.goBack = function(){
        console.log('called');
        $state.go('data-entry', {activityId:projectRequiredDetail.activityId});
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

	$scope.next = function(){
		$state.go('other-details');
	}

}]);