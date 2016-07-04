app.controller('CreateProjectCtrl', ['$scope', '$timeout', '$ionicPopup', '$state', '$ionicPopover', function($scope, $timeout,$ionicPopup, $state, $ionicPopover){

	getCities();

	//$scope.myId = window.localStorage.uid;
	$scope.myId = window.localStorage.getItem('uid');
	//$scope.myName = window.localStorage.name;
	$scope.myName = window.localStorage.getItem('name');
	console.log($scope.myId);

	$scope.cities = [];
	$scope.zones = [];
	$scope.address ={};
	$scope.hasCity = false;

	$scope.builders = [];
	$scope.cityDetails = {};
	$scope.zoneDetails = {};

	$scope.project = {
		projectId: '',
		projectStatus: '',
		version: '1-1',
		versionCreatedDate: '',
		versionCreatedBy: $scope.myId,
		buy: true,
		status: 'editable',
		projectDetails: {
			projectName: '',
			builderName: '',
			builderId: '',
			address: {
			}
		}
	}

	function getCities() {
		var cityData = firebase.database().ref('city');
	    cityData.on('value', function(data) {
	        console.log(data.val());
	        $timeout(function(){
	        	angular.forEach(data.val(), function(value, key){
	        	$scope.cities.push(value);
	        	//$timeout(function(){console.log($scope.cities);},50);
	        })
	        }, 50);
	        
		});
	}

	$scope.getZones = function(){
		console.log(JSON.parse($scope.address.selectedCity));
		if(!$scope.hasCity){
			$scope.cityDetails =JSON.parse($scope.address.selectedCity);
			$scope.hasCity = true;
			$scope.project.projectDetails.address.cityName = $scope.cityDetails.cityName;
			$scope.project.projectDetails.address.cityId = $scope.cityDetails.cityId;
			console.log($scope.cityDetails);
			var zoneData = firebase.database().ref('zone/'+$scope.cityDetails.cityId);
		     zoneData.on('value', function(data) {
		        //console.log(data.val());
		        $timeout(function(){
		        	angular.forEach(data.val(), function(value, key){
			         	$scope.zones.push(value);
			         	//$timeout(function(){console.log($scope.zones);},50);
			         })
			        //console.log($scope.zones);
		        }, 50);   
			});
		 }	
	}

	$scope.selectZone = function(){
		console.log(JSON.parse($scope.address.selectedZone));
		$scope.zoneDetails =JSON.parse($scope.address.selectedZone);
			$scope.project.projectDetails.address.zoneName = $scope.zoneDetails.zoneName;
			$scope.project.projectDetails.address.zoneId = $scope.zoneDetails.zoneId;
			var ref = db.ref().child('builders');
			ref.once('value', function(data){
				console.log(data.val());
				$timeout(function(){
					angular.forEach(data.val(), function(value, key){
						//console.log(value, key);
						$scope.lala = value;
						//console.log($scope.lala);
						$scope.builders.push($scope.lala);
						console.log($scope.builders);
					})
					//console.log($scope.builders);
				}, 100);
			});
	}

	$scope.allBuilders = [];
	$scope.detail = {
		name: '',
		id: ''
	}

	$scope.hideBuilders = true;
	$scope.showBuildersCalled = false;

	$scope.showBuilders = function(){
		if(!$scope.showBuildersCalled){
			angular.forEach($scope.builders, function(value, key){
			$scope.allBuilders = $scope.builders;
			$scope.showBuildersCalled = true;
		})

		}
		$scope.hideBuilders = !$scope.hideBuilders;
	}

	$scope.buildername = {};

	$scope.selectBuilder = function(selectedBuilder){
		console.log(selectedBuilder);
		$scope.buildername.query = selectedBuilder.name;
		console.log($scope.buildername.query);
		$scope.project.projectDetails.builderName = selectedBuilder.name;
		$scope.project.projectDetails.builderId = selectedBuilder.builderId;
		$scope.hideBuilders = true;
	}

	$scope.newKey = '';

	$scope.addNewProject = function(){
		

		$scope.project.versionCreatedDate = new Date().getTime();
		console.log($scope.project);

		var newProjectKey = db.ref("protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects").push().key;
		console.log(newProjectKey);
		var addProject = {};
		$scope.project.projectId = newProjectKey;
      	addProject["protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + newProjectKey+'/'+$scope.project.version] = $scope.project;
      	console.log("protectedResidential/"+$scope.project.projectDetails.address.cityId+"/projects/" + newProjectKey+'/'+$scope.project.version);
      	console.log(addProject);
      	db.ref().update(addProject);

      	$scope.projectAccess = {
      		cityId: $scope.project.projectDetails.address.cityId,
      		cityName: $scope.project.projectDetails.address.cityName
      	}

      	$scope.projectInfo = {
      		projectId: newProjectKey,
      		projectName: $scope.project.projectDetails.projectName,
      		version: $scope.project.version
      	}

      	var addProjectAccess = {};
      	addProjectAccess['admins/'+$scope.myId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityId'] = $scope.project.projectDetails.address.cityId;
      	addProjectAccess['admins/'+$scope.myId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityName'] = $scope.project.projectDetails.address.cityName;
      	addProjectAccess['builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityId'] =$scope.project.projectDetails.address.cityId;
      	addProjectAccess['builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityName'] =$scope.project.projectDetails.address.cityName;
      	addProjectAccess['protectedResidentialVersions/'+$scope.project.projectDetails.address.cityId+'/cityId'] = $scope.project.projectDetails.address.cityId;
      	addProjectAccess['protectedResidentialVersions/'+$scope.project.projectDetails.address.cityId+'/cityName'] = $scope.project.projectDetails.address.cityName;
      	//console.log(addProjectAccess);
      	db.ref().update(addProjectAccess);

      	var addProjectInfo = {};
      	addProjectInfo['admins/'+$scope.myId+ '/projectAccess/'+$scope.project.projectDetails.address.cityId+'/projects/'+newProjectKey]  = $scope.projectInfo;
      	addProjectInfo['builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/projects/'+newProjectKey]  = $scope.projectInfo;
      	addProjectInfo['city/'+$scope.project.projectDetails.address.cityId+'/projects/'+newProjectKey] = $scope.projectInfo;
      	addProjectInfo['zone/'+$scope.project.projectDetails.address.cityId+'/'+$scope.project.projectDetails.address.zoneId+'/projects/'+newProjectKey] = $scope.projectInfo;
      	addProjectInfo['protectedResidentialVersions/'+$scope.project.projectDetails.address.cityId+'/projects/'+newProjectKey+'/editable'] = $scope.projectInfo;
      	addProjectInfo['adminProjectAccess/'+$scope.project.projectDetails.address.cityId+'/projects/'+newProjectKey+'/'+$scope.myId+'/adminId'] = $scope.myId;
      	addProjectInfo['adminProjectAccess/'+$scope.project.projectDetails.address.cityId+'/projects/'+newProjectKey+'/'+$scope.myId+'/adminName'] = $scope.myName;

      	console.log(addProjectInfo);
      	db.ref().update(addProjectInfo);

      	$ionicPopup.alert({
			title: 'Successful',
			template: 'Project created successfully'
		});

		$scope.newKey = newProjectKey
		window.localStorage['project'] = JSON.stringify($scope.project);
		localStorage.setItem("cityid",$scope.project.projectDetails.address.cityId);
        localStorage.setItem("projectid",newProjectKey);
		//console.log(window.localStorage['project'] );
		$scope.project = {};
		$scope.selectedBuilder = {};
		$scope.selectedZone = {};
		$scope.selectedCity = {};
		$state.go('project-basic-details');
	}

	$scope.viewOtherForms = function(page){
		$state.go(page);
	}

	$ionicPopover.fromTemplateUrl('templates/dataEntry/popover.html', {
	    scope: $scope,
	  }).then(function(popover) {
	    $scope.popover = popover;
	  });

	 $scope.closePopover = function() {
	    $scope.popover.hide();
	  };

}]);


