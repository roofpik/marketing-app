app.config(function($stateProvider, $urlRouterProvider) {

  

   //State for login
   $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/auth/login.html',
      controller: 'LoginCtrl'
   });

   $stateProvider.state('resetPassword', {
      url: '/resetPassword',
      templateUrl: 'templates/auth/forgot-password.html',
      controller: 'resetPasswordCtrl'
   });

// Aditi's views
   $stateProvider.state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/planner/welcome.html',
      controller:'welCtrl'
    })
   $stateProvider.state('tasks', {
      url: '/tasks/:adminId',
      templateUrl: 'templates/planner/tasks.html',
      controller:'tasksCtrl'
    })

   $stateProvider.state('data-entry', {
      url: '/data-entry/:activityId',
      templateUrl: 'templates/planner/data-entry/data-entry.html',
      controller:'DataEntryCtrl'
    })

   $stateProvider.state('add-task', {
      url: '/add-task',
      templateUrl: 'templates/planner/add-task.html',
      controller:'AddTaskCtrl'
    })
   // Aditi's views

   $stateProvider.state('project-basic-details', {
    url: '/project-basic-details',
    templateUrl: 'templates/dataEntry/project-basic-details.html',
    controller: 'ProjectBasicDetailsCtrl'
  });

  $stateProvider.state('create-project', {
    url: '/create-project',
    templateUrl: 'templates/dataEntry/create-project.html',
    controller: 'CreateProjectCtrl'
  });

  $stateProvider.state('sports-n-clubhouse', {
    url: '/sports-n-clubhouse',
    templateUrl: 'templates/dataEntry/sports-n-clubhouse.html',
    controller: 'SportsNClubhouseCtrl'
  });
  $stateProvider.state('important-contacts', {
    url: '/important-contacts',
    templateUrl: 'templates/dataEntry/important-contacts.html',
    controller: 'ImportantContactsCtrl'
  });

  $stateProvider.state('security-details', {
    url: '/security-details',
    templateUrl: 'templates/dataEntry/security-details.html',
    controller: 'SecurityDetailsCtrl'
  });

  $stateProvider.state('other-details', {
    url: '/other-details',
    templateUrl: 'templates/dataEntry/other-details.html',
    controller: 'OtherDetailsCtrl'
  });

  $stateProvider.state('costing-details', {
    url: '/costing-details',
    templateUrl: 'templates/dataEntry/costing-details.html',
    controller: 'CostingDetailsCtrl'
  });

  $stateProvider.state('connectivity-details', {
    url: '/connectivity-details',
    templateUrl: 'templates/dataEntry/connectivity-details.html',
    controller: 'ConnectivityDetailsCtrl'
  });
  $stateProvider.state('society-shops', {
    url: '/society-shops',
    templateUrl: 'templates/dataEntry/society-shops.html',
    controller: 'SocietyShopsCtrl'
  });
  $stateProvider.state('near-me', {
    url: '/near-me',
    templateUrl: 'templates/dataEntry/near-me.html',
    controller: 'NearMeCtrl'
  });
  $stateProvider.state('units', {
    url: '/units',
    templateUrl: 'templates/dataEntry/units.html',
    controller: 'UnitsCtrl'
  });
  $stateProvider.state('ranking-rating', {
    url: '/ranking-rating',
    templateUrl: 'templates/dataEntry/ranking-rating.html',
    controller: 'RankingRatingCtrl'
  });

  $stateProvider.state('tags', {
    url: '/tags',
    templateUrl: 'templates/dataEntry/tags.html',
    controller: 'TagsCtrl'
  });

  $stateProvider.state('all-projects', {
    url: '/all-projects',
    templateUrl: 'templates/dataEntry/all-projects.html',
    controller: 'AllProjectsCtrl'
  });
  $stateProvider.state('all-forms', {
    url: '/all-forms',
    templateUrl: 'templates/dataEntry/all-forms.html',
    controller: 'AllFormsCtrl'
  });

   $stateProvider.state("home", {
      url: '/home',
      templateUrl: 'templates/home/home.html',
      controller: 'HomeCtrl',
      resolve: {
         currentAuth: function(AuthenticationService){
            return AuthenticationService.checkAuthentication();
         }
      }
   });

   // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/login');
});
