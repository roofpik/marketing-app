app.factory("AuthenticationService", function($http, $location, $timeout, $window, $q) {
    var service = {};
    service.LoginEmail = LoginEmail;
    service.Logout = Logout;
    service.checkAuthentication = checkAuthentication;

    return service;


    function LoginEmail(email, password) {
        var def = $q.defer();
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            db.ref().child("admins").child(user.uid).on("value", function(snapshot) {
                $timeout(function(){
                    window.localStorage.setItem("name", snapshot.val().fname);
                    window.localStorage.setItem("email", snapshot.val().email);
                    window.localStorage.setItem("uid", snapshot.val().uid);
                    
                    def.resolve(user);
                }, 50);
            });
        }).catch(function(error) {
            def.reject(error);
        });
        return def.promise;
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
