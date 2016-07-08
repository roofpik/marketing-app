app.factory("AuthenticationService", function($http, $location, $timeout, $window) {
    var service = {};
    service.LoginEmail = LoginEmail;
    service.Logout = Logout;
    service.checkAuthentication = checkAuthentication;

    return service;

    function LoginEmail(email, password, callback) {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            db.ref().child("admins").child(user.uid).on("value", function(snapshot) {
                window.localStorage.setItem("name", snapshot.val().fname);
                window.localStorage.setItem("email", email);
                window.localStorage.setItem("uid", user.uid);

                console.log(localStorage.getItem("uid"));

                $timeout(function() {
                    $location.path('/welcome/'+user.uid);
                }, 0);
            });


        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
    }

    function Logout() {
         console.log(window.localStorage);
        if (window.localStorage.email && window.localStorage.uid) {
            firebase.auth().signOut().then(function() {
                $window.localStorage.removeItem('name');
                $window.localStorage.removeItem('email');
                $window.localStorage.removeItem('uid');
                $window.localStorage.removeItem('project');
                $window.localStorage.removeItem('cityid');
                $window.localStorage.removeItem('projectid');
                $window.localStorage.removeItem('customerInfo');
                $window.localStorage.removeItem('selectedLocation');

                console.log(window.localStorage);

            }, function(error) {

            });
        }

    }

    function checkAuthentication() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("yes login");
                console.log(user);
                console.log(user.uid);
            } else {
                console.log("no login");
                $location.path("/login");
            }
        });
    }
});
