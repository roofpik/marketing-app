app.controller('CreateProjectCtrl', [ '$ionicHistory', '$scope', '$timeout', '$ionicPopup', '$state', '$ionicPopover', '$ionicLoading', 
	function($ionicHistory, $scope, $timeout,$ionicPopup, $state, $ionicPopover, $ionicLoading){
	$ionicLoading.show({
	    template: 'Loading...'
	});
	$timeout(function(){
		$ionicLoading.hide();
	}, 8000); 
	getCities();

	//$scope.myId = window.localStorage.uid;
	$scope.myId = localStorage.getItem('uid');
	//$scope.myName = window.localStorage.name;
	$scope.myName = localStorage.getItem('name');
	console.log($scope.myId);

	$scope.cities = [];
	$scope.zones = [];
	$scope.address ={};
	$scope.hasCity = false;

	$scope.builders = [];
	$scope.cityDetails = {};
	$scope.zoneDetails = {};

	$scope.project = {
		version: '1-1',
		versionCreatedBy: $scope.myId,
		buy: true,
		status: 'editable',
		projectDetails: {
			address: {
			}
		}
	}

	$scope.sector = {
		name:''
	}

	$scope.projectType = '';

	$scope.selectProjectType = function(value){
		$scope.projectType = value;
		console.log($scope.projectType);
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
	        	$ionicLoading.hide();
	        }, 50);
	        
		});
	}

	$scope.getZones = function(){
		console.log(JSON.parse($scope.address.selectedCity));
		if(!$scope.hasCity){
			$ionicLoading.show({
			    template: 'Loading...'
			});
			$timeout(function(){
				$ionicLoading.hide();
			}, 8000); 
			$scope.cityDetails =JSON.parse($scope.address.selectedCity);
			$scope.hasCity = true;
			$scope.project.projectDetails.address.cityName = $scope.cityDetails.cityName;
			$scope.project.projectDetails.address.cityId = $scope.cityDetails.cityId;
			console.log($scope.cityDetails);
			var zoneData = firebase.database().ref('zone/'+$scope.cityDetails.cityId);
		     zoneData.on('value', function(data) {
		        $timeout(function(){
		        	angular.forEach(data.val(), function(value, key){
			         	$scope.zones.push(value);
			         })
		        	$ionicLoading.hide();
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

		var exist = false;

		$ionicLoading.show({
		    template: 'Loading...'
		});
		$timeout(function(){
			$ionicLoading.hide();
		}, 8000); 
		
		if($scope.projectType == ''){
			$ionicLoading.hide();
			$ionicPopup.alert({
				title:'Warning',
				template: 'Project Type not selected'
			})
		} else {
			if($scope.projectType == 'protectedResidential'){
      			$scope.projectLogType = 'residential';
      		} else if($scope.projectType == 'pg'){
      			$scope.projectLogType = 'pg';
      		}

			if($scope.sector.name != ''){
				$scope.project.projectDetails.address.landmark = $scope.sector.name+ ', '+$scope.project.projectDetails.address.zoneName;
				console.log($scope.project.projectDetails.address.landmark);
			} else {
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Landmark Not Added'
				})
				console.log('empty');
			}
      		if($scope.project.projectDetails.address.cityId != undefined && $scope.project.projectDetails.address.zoneId != undefined &&$scope.project.projectDetails.builderId != undefined && ($scope.project.projectName != undefined ||$scope.project.projectName.length != 0)){
				db.ref("zone/"+$scope.project.projectDetails.address.cityId+'/'+$scope.project.projectDetails.address.zoneId+'/'+$scope.projectLogType).once('value', function(snapshot){
					angular.forEach(snapshot.val(), function(value, key){
						if(value.projectName == $scope.project.projectName){
							exist = true;
						}
					})
				})
			} else {
				$ionicLoading.hide();
				$ionicPopup.alert({
					title:'Empty Fields',
					template: 'Please fill the missing fields'
				})
			}

			var addProjectPermission = false;

			if(exist){
				$ionicLoading.hide();
				$ionicPopup.confirm({
					title:'Already Exists',
					template: 'This project name already exists. Do you still want to add this project?'
				}).then(function(res){
					console.log(res);
					if(res){
						$scope.addThisProject();
					}
				})
			} else {
				$scope.addThisProject();
			}
			console.log(addProjectPermission);
	    }
	}

	$scope.addThisProject = function(){
		$scope.project.versionCreatedDate = new Date().getTime();
				console.log($scope.project);

				var newProjectKey = db.ref($scope.projectType+"/"+$scope.project.projectDetails.address.cityId+"/projects").push().key;
				console.log(newProjectKey);
				var addProject = {};
				$scope.project.projectId = newProjectKey;
		      	addProject[$scope.projectType+"/"+$scope.project.projectDetails.address.cityId+"/projects/" + newProjectKey+'/'+$scope.project.version] = $scope.project;
		      	console.log($scope.projectType+"/"+$scope.project.projectDetails.address.cityId+"/projects/" + newProjectKey+'/'+$scope.project.version);
		      	console.log(addProject);
		      	db.ref().update(addProject);

		      	$scope.projectAccess = {
		      		cityId: $scope.project.projectDetails.address.cityId,
		      		cityName: $scope.project.projectDetails.address.cityName
		      	}

		      	$scope.projectInfo = {
		      		projectId: newProjectKey,
		      		projectName: $scope.project.projectName,
		      		version: $scope.project.version
		      	}

		      	var addProjectAccess = {};
		      	addProjectAccess['admins/'+$scope.myId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityId'] = $scope.project.projectDetails.address.cityId;
		      	addProjectAccess['admins/'+$scope.myId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityName'] = $scope.project.projectDetails.address.cityName;
		      	if($scope.project.projectDetails.builderId != undefined){
		      		addProjectAccess['builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityId'] =$scope.project.projectDetails.address.cityId;
		      		addProjectAccess['builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityName'] =$scope.project.projectDetails.address.cityName;
		      	}
		      	addProjectAccess[$scope.projectType+'Versions/'+$scope.project.projectDetails.address.cityId+'/cityId'] = $scope.project.projectDetails.address.cityId;
		      	addProjectAccess[$scope.projectType+'Versions/'+$scope.project.projectDetails.address.cityId+'/cityName'] = $scope.project.projectDetails.address.cityName;
		      	//console.log(addProjectAccess);
		      	db.ref().update(addProjectAccess);

		      	var addProjectInfo = {};
		      	addProjectInfo['admins/'+$scope.myId+ '/projectAccess/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey]  = $scope.projectInfo;
		      	if($scope.project.projectDetails.builderId != undefined){
		      		addProjectInfo['builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey]  = $scope.projectInfo;
		      	}
		      	addProjectInfo['city/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey] = $scope.projectInfo;
		      	addProjectInfo['zone/'+$scope.project.projectDetails.address.cityId+'/'+$scope.project.projectDetails.address.zoneId+'/'+$scope.projectLogType+'/'+newProjectKey] = $scope.projectInfo;
		      	addProjectInfo[$scope.projectType+'Versions/'+$scope.project.projectDetails.address.cityId+'/projects/'+newProjectKey+'/editable'] = $scope.projectInfo;
		      	addProjectInfo['adminProjectAccess/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey+'/'+$scope.myId+'/adminId'] = $scope.myId;
		      	addProjectInfo['adminProjectAccess/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey+'/'+$scope.myId+'/adminName'] = $scope.myName;

		      	console.log(addProjectInfo);
		      	db.ref().update(addProjectInfo).then(function(){
		      		var projectLogDetails = {};
		      		projectLogDetails['projectLog/'+$scope.project.projectDetails.address.cityId+'/cityId'] = $scope.project.projectDetails.address.cityId;
		      		projectLogDetails['projectLog/'+$scope.project.projectDetails.address.cityId+'/cityName'] = $scope.project.projectDetails.address.cityName;
		      		db.ref().update(projectLogDetails).then(function(){
			      		var newKey = db.ref('projectLog/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey+'/projectId').push().key;
			      		console.log(newKey);
			      		$scope.log = {
			      			time: new Date().getTime(),
			      			title:'Project Created',
			      			details: $scope.myName+' created the project '+$scope.project.projectName,
			      			adminId: $scope.myId,
			      			adminName: $scope.myName,
			      			logId: newKey
			      		}
			      		var projectLog = {};
			      		projectLog['projectLog/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey+'/projectId'] = newProjectKey; 		
			      		projectLog['projectLog/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey+'/projectName'] = $scope.project.projectName; 		
			      		projectLog['projectLog/'+$scope.project.projectDetails.address.cityId+'/'+$scope.projectLogType+'/'+newProjectKey+'/log/'+newKey] = $scope.log; 		
			      		console.log(projectLog);
			      		db.ref().update(projectLog).then(function(){
							$ionicPopup.alert({
								title: 'Successful',
								template: 'Project created successfully'
							}).then(function(){
								var projectRequiredDetail = {};
								projectRequiredDetail.version = $scope.project.version;
								projectRequiredDetail.projectId = newProjectKey;
								projectRequiredDetail.cityId = $scope.project.projectDetails.address.cityId;
								localStorage.setItem('projectRequiredDetail',JSON.stringify(projectRequiredDetail));
								console.log(localStorage.getItem('projectRequiredDetail'));
								$scope.project = {};
								$scope.selectedBuilder = {};
								$scope.selectedZone = {};
								$scope.selectedCity = {};
								$ionicLoading.hide();
								$state.go('welcome', {adminId: $scope.myId});
							});	
			      		});
		      		});
		      	});
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

	   $scope.myGoBack = function() {
	    $state.go('welcome');
	  };

}]);


