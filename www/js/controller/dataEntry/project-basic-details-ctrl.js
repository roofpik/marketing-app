app.controller('ProjectBasicDetailsCtrl', ['$ionicHistory', '$scope', '$stateParams','$ionicPopup', '$state', '$timeout', '$ionicPopover', '$ionicLoading', 
    function($ionicHistory, $scope, $stateParams, $ionicPopup, $state,$timeout, $ionicPopover, $ionicLoading){

    $ionicLoading.show({
        template: 'Loading...'
      });
    var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));

    $scope.projectId = projectRequiredDetail.projectId;
    $scope.cityId = projectRequiredDetail.cityId;
    $scope.editableVersion = projectRequiredDetail.version;
    $scope.projectType = projectRequiredDetail.projectType;
    console.log($scope.projectId);
    console.log($scope.cityId);
    console.log($scope.editableVersion);
    getProjectDetails();
    $scope.projectName = '';
    
    $scope.formName = 'project-basic-details';

    $scope.projectDetails={
        projectType: {},
        approvedBankLoans: {},
        floors: {},
        lifts: {},
        partners: {}
    };
    getBuyRent();

    function getBuyRent(){
        db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/buy').once('value', function(snapshot){
            console.log(snapshot.val());
            if(snapshot.val() != null){
                $scope.buy = snapshot.val();
            }
        });
        db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/rent').once('value', function(snapshot){
            console.log(snapshot.val());
            if(snapshot.val() != null){
                $scope.rent = snapshot.val();
            }
        });
        db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/projectName').once('value', function(snapshot){
            console.log(snapshot.val());
            if(snapshot.val() != null){
                $scope.projectName  = snapshot.val();
            }
        });
    }

    $scope.selectBuyRent = function(val){
        if($scope[val] == undefined){
            $scope[val] = true;
            db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/'+val).set(true);
        } else {
            $scope[val] = !$scope[val];
            db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/'+val).remove();
        }
        console.log($scope[val]);
    }

	//console.log(window.localStorage['project']);
     $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $timeout(function(){
            console.log("changed");
            if(mapInitialize == 0){
                initialize();
            }
          //window.location.reload(true);
        },2000);
      });

    function getProjectDetails(){
    	console.log('called');
    	console.log($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion);
        firebase.database().ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/projectDetails').once('value', function(snapshot) {
            console.log(snapshot.val());
            $timeout(function(){
                // $scope.projectDetails = snapshot.val();
            	var details = snapshot.val();
            	$scope.projectDetails.address = details.address;
                if(details.builderName != undefined){
                    $scope.projectDetails.builderName = details.builderName;   
                }
                if(details.builderId != undefined){
                  $scope.projectDetails.builderId = details.builderId;  
                }
                if($scope.projectDetails.completionDate != undefined){
                    $scope.projectDetails.address = details.address;
                }
                if(details.projectType != undefined){
                    $scope.projectDetails.projectType = details.projectType;
                } else {
                    $scope.projectDetails.projectType = {
                    };
                }
                if(details.approvedBankLoans != undefined){
                    $scope.projectDetails.approvedBankLoans = details.approvedBankLoans;
                }else{
                    $scope.projectDetails.approvedBankLoans = {

                    };
                }
                if(details.floors != undefined){
                    $scope.projectDetails.floors = details.floors;
                } else {
                    $scope.projectDetails.floors = {

                    };
                }
                if(details.lifts != undefined){
                    $scope.projectDetails.lifts = details.lifts;
                } else {
                    $scope.projectDetails.lifts = {
                    };
                }
                if(details.partners != undefined){
                    $scope.projectDetails.partners = details.partners;
                } else {
                    $scope.projectDetails.partners = {};
                }
            	console.log($scope.projectDetails);
	         	getLocations();
            },1000);    
         });
    };

    $scope.types1 = [
    	{id:'apartment', name: 'Apartment'},
    	{id: 'villa', name: 'Villa'},
    	{id: 'rowHouse', name: 'Row House'}
    ];

    $scope.types2 = [
    	{id: 'studio', name: 'Studio'},
    	{id: 'servicedApartment', name: 'Serviced Apartment'}
    ];

    $scope.selectType = function(val){
    	console.log(val);
    	if($scope.projectDetails.projectType[val] == false) {
			$scope.projectDetails.projectType[val] = true;
		} else {
			$scope.projectDetails.projectType[val] = !$scope.projectDetails.projectType[val];
			if($scope.projectDetails.projectType[val] == false){
				delete $scope.projectDetails.projectType[val];
			}
		}
        // $scope.projectDetails.projectType[val] = !$scope.projectDetails.projectType[val];
        // if($scope.projectDetails.projectType[val] == false){
        //     delete $scope.projectDetails.projectType[val];
        //  }
		console.log($scope.projectDetails.projectType);
    }

    $scope.extras = [
    	{id: 'carParking', name: 'Car Parking', icon: 'icon ion-android-car'},
    	{id: 'visitorCarParking', name: 'Visitor Car Parking', icon: 'icon ion-model-s'},
    	{id: 'vastuCompliant', name: 'Vastu Compliant', icon: 'icon ion-android-compass'}
    ];

    $scope.selectExtras = function(val){
    	console.log(val);
    	if($scope.projectDetails[val] == undefined) {
			$scope.projectDetails[val] = true;
		} else {
			$scope.projectDetails[val] = !$scope.projectDetails[val];
			if($scope.projectDetails[val] == false){
				delete $scope.projectDetails[val];
			}
		}
		console.log($scope.projectDetails);
    }

    $scope.banks1 = [
    	{id:'HDFC', name: 'HDFC'},
    	{id:'SBI', name: 'SBI'},
    	{id:'AXIS', name: 'AXIS'}
    ];

    $scope.banks2 = [
    	{id:'ICICI', name: 'ICICI'},
    	{id:'KOTAK', name: 'KOTAK'},
    	{id:'HSBC', name: 'HSBC'}
    ];


    $scope.selectBank = function(val){
    	console.log(val);
    	if($scope.projectDetails.approvedBankLoans[val] == undefined) {
			$scope.projectDetails.approvedBankLoans[val] = true;
		} else {
			$scope.projectDetails.approvedBankLoans[val] = !$scope.projectDetails.approvedBankLoans[val];
			if($scope.projectDetails.approvedBankLoans[val] == false){
				delete $scope.projectDetails.approvedBankLoans[val];
			}
		}
		console.log($scope.projectDetails.approvedBankLoans);
    }

	$scope.locations = [];
	$scope.wantLocations = false;

	// // getLocations();

	function getLocations(){
		console.log('location/'+$scope.projectDetails.address.cityId, $scope.projectDetails.address.zoneId);
		var locationData = firebase.database().ref('location/'+$scope.projectDetails.address.cityId).orderByChild('zoneId').equalTo($scope.projectDetails.address.zoneId);
		console.log(locationData);
	     locationData.on('value', function(data) {
	        console.log(data.val());
	        $timeout(function(){
	        	angular.forEach(data.val(), function(value, key){
	        		angular.forEach($scope.projectDetails.address.locations, function(value1, key1){
		         		if(value.locationId == value1.locationId){
		         			value.checked = true;
		         		}
		         	})
		         	$scope.locations.push(value);
		         })
		        console.log($scope.locations);	
                $ionicLoading.hide();
	        },50);   
		});
	}

	$scope.displayLocation = function(){
		$scope.wantLocations = !$scope.wantLocations;
	}

	$scope.selectLocation = function(value){
		console.log(value);
		if(value.checked == undefined) {
			value.checked = true;
		} else {
			value.checked = !value.checked;
		}
		console.log($scope.locations);
	}

	$scope.chosenLocations = [];
	$scope.lala = {
		locationName: '',
		locationId: ''
	}

	$scope.save = function(){
        console.log($scope.projectDetails);
		var addProjectDetails = {};
        $ionicLoading.show({
            template: 'Loading...'
        });

		console.log($scope.projectDetails);

      	addProjectDetails[$scope.projectType+"/"+$scope.projectDetails.address.cityId+"/projects/" + $scope.projectId +'/'+$scope.editableVersion+"/projectDetails"] = $scope.projectDetails;
      	console.log(addProjectDetails);
      	db.ref().update(addProjectDetails);
      	$scope.projectInfo = {
      		projectId: $scope.projectId,
      		projectName: $scope.projectName,
      		version: $scope.editableVersion
      	}

       	var locationsData = {};

		angular.forEach($scope.locations, function(value, key){
            if($scope.projectType == 'protectedResidential'){
                $scope.resOrpg = 'residential';
            } else{
                $scope.resOrpg = 'pg';
            }
			if(value.checked){
				$scope.lala.locationName = value.locationName;
				$scope.lala.locationId = value.locationId;
				console.log($scope.projectType+'/'+$scope.projectDetails.address.cityId+'/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/projectDetails/address/locations/'+value.locationId);
				locationsData[$scope.projectType+'/'+$scope.projectDetails.address.cityId+'/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/projectDetails/address/locations/'+value.locationId] =$scope.lala;
				locationsData['location/'+$scope.projectDetails.address.cityId+'/'+$scope.lala.locationId+'/'+$scope.resOrpg+'/'+$scope.projectId] = $scope.projectInfo;
			}
		});
		 console.log(locationsData);
      	db.ref().update(locationsData);

      	$ionicPopup.alert({
			title: 'Successful',
			template: 'Project Details updates successfully'
		}).then(function(){
            $ionicLoading.hide();
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

    var mapInitialize = 0;

	function initialize() {
        mapInitialize = 1;
            var mapOptions = {
                center: { lat: 28.613939, lng: 77.209021 },
                zoom: 13,
                disableDefaultUI: true,// DISABLE MAP TYPE
                scrollwheel: false
            };
            var map = new google.maps.Map(document.getElementById('map'),
                mapOptions);

            var input = /** @type {HTMLInputElement} */ (
                document.getElementById('pac-input'));

            // Create the autocomplete helper, and associate it with
            // an HTML text input box.
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });

            // Get the full place details when the user selects a place from the
            // list of suggestions.
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                infowindow.close();
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }

                // Set the position of the marker using the place ID and location.
                marker.setPlace( /** @type {!google.maps.Place} */ ({
                    placeId: place.place_id,
                    location: place.geometry.location
                }));
                $scope.projectDetails.address.placeId = '';
                $scope.projectDetails.address.lat = '';
                $scope.projectDetails.address.lng = '';
                $scope.projectDetails.address.placeId = place.place_id;
                $scope.projectDetails.address.lat = place.geometry.location.lat();
                $scope.projectDetails.address.lng = place.geometry.location.lng();
                console.log($scope.projectDetails.address);

             	marker.setVisible(true);

                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    'Place ID: ' + place.place_id + '<br>' +
                    place.formatted_address + '</div>');
                infowindow.open(map, marker);
            });
        }

        // Run the initialize function when the window has finished loading.
        google.maps.event.addDomListener(window, 'load', initialize);
	
}]);