app
.controller('IntroSliderCtrl', ['$scope', '$ionicSlideBoxDelegate', '$state', function($scope,$ionicSlideBoxDelegate,$state) {
    console.log("Intro Slider Controller");
    $scope.firstTime = true;

    $scope.skipSlide = function(){
        console.log("next");
        $state.go('login');
        localStorage.setItem('firstTime', false);


        console.log(localStorage.getItem('firstTime'));
    }
    $scope.nextSlide = function(){
        if($ionicSlideBoxDelegate.currentIndex()<3){
            $ionicSlideBoxDelegate.next();
        }else{
            console.log("next");
            $state.go('login');
            localStorage.setItem('firstTime', false);
        }
    }
}]);
