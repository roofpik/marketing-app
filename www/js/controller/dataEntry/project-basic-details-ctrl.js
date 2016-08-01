app.controller('ProjectBasicDetailsCtrl', ['$ionicHistory', '$scope', '$stateParams','$ionicPopup', '$state', '$timeout', '$ionicPopover', '$ionicLoading', 
    function($ionicHistory, $scope, $stateParams, $ionicPopup, $state,$timeout, $ionicPopover, $ionicLoading){

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $timeout(function(){
            //console.log("changed");
            if(mapInitialize == 0){
                initialize();
            }
        },2000);
      });

    $ionicLoading.show({
        template: 'Loading...'
    });

    $timeout(function(){
        $ionicLoading.hide();
    }, 8000); 
    var projectRequiredDetail = JSON.parse(localStorage.getItem('projectRequiredDetail'));

    $scope.projectId = projectRequiredDetail.projectId;
    console.log($scope.projectId);
    $scope.cityId = projectRequiredDetail.cityId;
    $scope.editableVersion = projectRequiredDetail.version;
    $scope.projectType = projectRequiredDetail.projectType;
    $scope.project = {};
    $scope.builders = [];
    $scope.buildername = {};
    $scope.hideBuilders = true;

    $scope.previousZone  = '';
    $scope.previousBuilder = '';

    $scope.formName = 'project-basic-details';

    $scope.date = {
        month: '',
        year: ''
    }

    $scope.address= {
        selectedZone:{},
        landmark: ''
    };
    $scope.landmarkVal;


    $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December'];
    
    $scope.selectCompletionMonth = function(){
        //console.log($scope.date.month);
    }

    getProjectDetails();

    function getProjectDetails() {
        db.ref($scope.projectType+'/'+$scope.cityId +'/projects/'+$scope.projectId+'/'+$scope.editableVersion).once('value', function(snapshot){
            //console.log(snapshot.val());
            $scope.project = snapshot.val();
            $scope.previousZone = $scope.project.projectDetails.address.zoneId;
            $scope.previousBuilder = $scope.project.projectDetails.builderId;
            $scope.buildername.query = $scope.project.projectDetails.builderName;
            $scope.landmarkVal = $scope.project.projectDetails.address.landmark.split(',');
            $scope.address.landmark = $scope.landmarkVal[0];
        }).then(function(){
            getBuilders();
        })
    }

    function getBuilders() {
        db.ref('builders').once('value', function(data){
            $timeout(function(){
                angular.forEach(data.val(), function(value, key){
                    $scope.builders.push(value);
                })
                //console.log($scope.builders);
                getZones();
            }, 100);
        });
    }

    $scope.showBuilders = function(){
        $scope.hideBuilders = false;
    }

    $scope.selectBuyRent = function(val){
        if($scope.project[val] == undefined){
            $scope.project[val] = true;
            db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/'+val).set(true);
        } else {
            $scope[val] = !$scope[val];
            db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/'+val).remove();
        }
        //console.log($scope.project[val]);
    }

    $scope.selectVerified = function(){
        $scope.project.validated = !$scope.project.validated;
        if($scope.project.validated){
            //console.log($scope.project.validated);
            db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/validated').set(true);
        } else {
            db.ref($scope.projectType+'/' + $scope.cityId + '/projects/'+$scope.projectId+'/'+$scope.editableVersion+'/validated').remove();
        }
    }

    $scope.selectBuilder = function(selectedBuilder){
        //console.log(selectedBuilder);
        $scope.project.projectDetails.builderName = selectedBuilder.name;
        $scope.project.projectDetails.builderId = selectedBuilder.builderId;
        $scope.buildername.query = $scope.project.projectDetails.builderName;
        $scope.hideBuilders = true;
        //console.log($scope.project);
    }
    $scope.zones = [];

    function getZones(){
        var zoneData = firebase.database().ref('zone/'+$scope.cityId);
         zoneData.on('value', function(data) {
            //console.log(data.val());
            $timeout(function(){
                angular.forEach(data.val(), function(value, key){
                    $scope.zones.push(value);
                    //$timeout(function(){console.log($scope.zones);},50);
                 })
                $ionicLoading.hide();
                //console.log($scope.zones);
            }, 50);   
        });  
    }

    $scope.selectZone = function(){
        console.log(JSON.parse($scope.address.selectedZone));
        $scope.zoneDetails =JSON.parse($scope.address.selectedZone);
        $scope.project.projectDetails.address.zoneName = $scope.zoneDetails.zoneName;
        $scope.project.projectDetails.address.zoneId = $scope.zoneDetails.zoneId;
    }

    $scope.types1 = [
        {id:'apartment', name: 'Apartment'},
        {id: 'villa', name: 'Villa'},
        {id: 'rowHouse', name: 'Row House'}
    ];

    $scope.types2 = [
        {id: 'studio', name: 'Studio'},
        {id: 'servicedApartment', name: 'Serviced Apartment'},
        {id: 'penthouse', name: 'Penthouse'}
    ];

    $scope.selectType = function(val){
        console.log(val);
        if($scope.project.projectDetails.projectType == undefined){
            $scope.project.projectDetails.projectType = {};
        }
        $scope.project.projectDetails.projectType[val] = !$scope.project.projectDetails.projectType[val];
        if(!$scope.project.projectDetails.projectType[val]){
            delete $scope.project.projectDetails.projectType[val];
        }

        // if($scope.project.projectDetails.projectType[val] == false) {
        //     $scope.project.projectDetails.projectType[val] = true;
        // } else {
        //     $scope.project.projectDetails.projectType[val] = !$scope.project.projectDetails.projectType[val];
        //     if($scope.project.projectDetails.projectType[val] == false){
        //         delete $scope.project.projectDetails.projectType[val];
        //     }
        // }
        // $scope.projectDetails.projectType[val] = !$scope.projectDetails.projectType[val];
        // if($scope.projectDetails.projectType[val] == false){
        //     delete $scope.projectDetails.projectType[val];
        //  }
        console.log($scope.project.projectDetails.projectType);
    }

    $scope.extras = [
        {id: 'carParking', name: 'Car Parking', icon: 'icon ion-android-car'},
        {id: 'visitorCarParking', name: 'Visitor Car Parking', icon: 'icon ion-model-s'}
        // {id: 'vastuCompliant', name: 'Vastu Compliant', icon: 'icon ion-android-compass'}
    ];

    $scope.selectExtras = function(val){
        //console.log(val);
        if($scope.project.projectDetails[val] == undefined) {
            $scope.project.projectDetails[val] = true;
        } else {
            $scope.project.projectDetails[val] = !$scope.project.projectDetails[val];
            if($scope.project.projectDetails[val] == false){
                delete $scope.project.projectDetails[val];
            }
        }
        //console.log($scope.project.projectDetails);
    }

    var builderProjectType = '';

    $scope.save = function(){
        if($scope.projectType = 'protectedResidential'){
            builderProjectType = 'residential';
        }

        $ionicLoading.show({
            template: 'Loading...'
        });

        $timeout(function(){
            $ionicLoading.hide();
        }, 8000); 
        $scope.project.projectDetails.address.landmark = $scope.address.landmark+ ', '+ $scope.project.projectDetails.address.zoneName;
        if($scope.project.projectDetails.builderId == $scope.previousBuilder && $scope.project.projectDetails.address.zoneId == $scope.previousZone){
           db.ref($scope.projectType+'/'+$scope.cityId +'/projects/'+$scope.projectId+'/'+$scope.editableVersion).update($scope.project).then(function(){
                //console.log("updated");
                $ionicLoading.hide();
                $state.go('add-project-locations');
            }); 
       } else if($scope.project.projectDetails.builderId != $scope.previousBuilder && $scope.project.projectDetails.address.zoneId == $scope.previousZone){
            db.ref($scope.projectType+'/'+$scope.cityId +'/projects/'+$scope.projectId+'/'+$scope.editableVersion).update($scope.project).then(function(){
                // console.log("updated");
                // $ionicLoading.hide();
                // $state.go('add-project-locations');
                $scope.addProjectToBuilder();
            });
       } else if($scope.project.projectDetails.builderId == $scope.previousBuilder && $scope.project.projectDetails.address.zoneId != $scope.previousZone){
            db.ref($scope.projectType+'/'+$scope.cityId +'/projects/'+$scope.projectId+'/'+$scope.editableVersion).update($scope.project).then(function(){
                // console.log("updated");
                // $ionicLoading.hide();
                // $state.go('add-project-locations');
                $scope.addProjectToZone(1);
            });
       } else if($scope.project.projectDetails.builderId != $scope.previousBuilder && $scope.project.projectDetails.address.zoneId != $scope.previousZone){
             db.ref($scope.projectType+'/'+$scope.cityId +'/projects/'+$scope.projectId+'/'+$scope.editableVersion).update($scope.project).then(function(){
                // console.log("updated");
                // $ionicLoading.hide();
                // $state.go('add-project-locations');
                $scope.addProjectToZone(2);
            });
       }
    }

    $scope.addProjectToZone = function(val){
        $scope.projectToBuilder = {
            projectId: $scope.projectId,
            projectName : $scope.project.projectName
        }
        db.ref('zone/'+$scope.cityId+'/'+$scope.project.projectDetails.address.zoneId+'/'+builderProjectType+'/'+$scope.projectId).update($scope.projectToBuilder).then(function(){
           db.ref('zone/'+$scope.cityId+'/'+$scope.previousZone+'/'+builderProjectType+'/'+$scope.projectId).remove().then(function(){
                console.log('updated');
                if(val == 1){
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title:'Successfully Updated',
                        template: 'Details Successfully Updated'
                    }).then(function(){
                        $state.go('add-project-locations');
                    });
                } else {
                    $scope.addProjectToBuilder();
                } 
           })
        })
    }

    $scope.addProjectToBuilder = function(){
        console.log('addProjectToBuilder called');
        $scope.projectToBuilder = {
            projectId: $scope.projectId,
            projectName : $scope.project.projectName
        }

        var changeDetails= [];
        changeDetails['builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityId'] =$scope.project.projectDetails.address.cityId;
        changeDetails['builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/cityName'] =$scope.project.projectDetails.address.cityName;
        db.ref().update(changeDetails).then(function(){
            db.ref('builders/'+$scope.previousBuilder+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/'+builderProjectType+'/'+$scope.projectId).remove().then(function(){
                console.log($scope.projectToBuilder);

                db.ref('builders/'+$scope.project.projectDetails.builderId+'/projectAccess/'+$scope.project.projectDetails.address.cityId+'/'+builderProjectType+'/'+$scope.projectId).update($scope.projectToBuilder).then(function(){
                    console.log('updated');
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title:'Successfully Updated',
                        template: 'Details Successfully Updated'
                    }).then(function(){
                        $state.go('add-project-locations');
                    });
                });
            });
        });
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
                $scope.project.projectDetails.address.placeId = '';
                $scope.project.projectDetails.address.lat = '';
                $scope.project.projectDetails.address.lng = '';
                $scope.project.projectDetails.address.placeId = place.place_id;
                $timeout(function(){
                    $scope.project.projectDetails.address.lat = place.geometry.location.lat();
                    $scope.project.projectDetails.address.lng = place.geometry.location.lng();
                }, 50);
                //console.log($scope.projectDetails.address);

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