angular.module('auth', [
  'cache'])

.factory('user', [
  '$q',
  '$http',
  '$rootScope',
  '$state',
  '$angularCacheFactory',
  '$window',
  'growl',


  function($q, $http, $rootScope, $state, $angularCacheFactory, $window, growl) {

    var userInfo = $rootScope.userInfo = {};
    var baseUrl = '/-/api';
    var loginUrl = baseUrl + '/login';
    var logoutUrl = baseUrl + '/logout';
    var userPromise = null;

    function login(username, password) {
      return $http({ cache: false, method: 'POST',  url: loginUrl, data: {
        username: username,
        password: password
      }})
      .then(function(response) {
        angular.extend(userInfo, response.data.results);
        return response;
      });
    }

    function resetInfo() {
      for(var k in userInfo) {
        delete userInfo[k];
      }
    }

    function logout() {
      return $http({ cache: false, method: 'GET',  url: logoutUrl})
        .success(function(data) {
          resetInfo();
          console.log("$angularCacheFactory.get('dataCache'):",$angularCacheFactory.get('dataCache'));
          $angularCacheFactory.get('dataCache').removeAll(); 
          $window.location = '/';
        });
    }

    function isLoggedIn(forced) {
      if(!forced){
        return userInfo !== null;
      } else {
        // TODO: How to resolve http.get as value before returning??
        // $http.get(loginUrl).then
      }
    }

    function checkLoggedin() {
      return userPromise || (userPromise = $http({
        cache: false,
        method: 'GET',
        url: [baseUrl, "user-info"].join('/')
      })
      .then(function(response) {
        if(response.data.status === 'OK'){
          angular.extend(userInfo, response.data.results);
          return response;
        } else {
          return response;
        }
      }));
    }

    return {
      info: userInfo,
      login: login,
      logout: logout,
      resetInfo: resetInfo,
      isLoggedIn: isLoggedIn,
      checkLoggedin: checkLoggedin
    };

  }
]);
angular.module('cache', [
  'jmdobry.angular-cache'
])


.factory('memoryStore', [function () {
  var mMap = {};

  return {
    getItem: function (key) {
      return mMap[key];
    },
    setItem: function (key, value) {
      mMap[key] = value;
    },
    removeItem: function (key) {
      delete mMap[key];
    }
  };

}])

.run([
  '$http',
  '$rootScope',
  '$state',
  '$stateParams',
  '$angularCacheFactory',
  'memoryStore',

  function ($http, $rootScope, $state, $stateParams, $angularCacheFactory, memoryStore) {
    var dataCache = $angularCacheFactory('dataCache', {
      // Items added to this cache expire after 10 minutes
      maxAge: 10 * 60 * 1000,
      // Items will be actively deleted when they expire
      deleteOnExpire: 'aggressive',
      // This cache will check for expired items every minute
      recycleFreq: 60000,
      // This cache will sync itself with localStorage
      storageMode: 'localStorage',
       // angular-cache will use this polyfill instead of looking for localStorage
      storageImpl: memoryStore,
      // Full synchronization with localStorage on every operation
      verifyIntegrity: true
    });

//  $http.defaults.cache = dataCache;
  }
])


;
angular.module('prepApp', [
  'angular-loading-bar',
  'ngAnimate',
  'monospaced.elastic',
  'ui.bootstrap',
  'ui.router',
  'angular-growl',
  'auth'
])

.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });
})

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

      $urlRouterProvider.otherwise("/");
      
      $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "ext/home/home.html",
        controller : "prepController"
      })
      .state('intermediate', {
        url: "/",
        templateUrl: "ext/intermediate/intermediate.html",
        controller : "prepController"
      })


      .state('partner', {
        url: "/home",
        templateUrl: "ext/partner/partner.html",
        resolve: {
          partnerDashData: ['$http','$state','growl', '$stateParams','user', function($http, $state, growl,$stateParams, user) {
            return $http({
              method: 'GET',
                url: '/-/api/partnerDash/',
                params: {partner : user.info.username}
            }).
            success(function(resp, status) {
              return resp.results;
            })
            .error(function(err) {
              $state.go("home", {}, {location: 'replace'});
              console.log(err);
                //throw err;
            });
          }]
        },
        controller : "prepController"
      })

      .state('partner.createQuestion', {
        url: "/create-question",
        templateUrl: "ext/createQuestions/createQuestion.html",
        controller : "createQuestionCtrl"
      })
      
      ;
        
}])


.controller('prepController', 
  [
    '$scope', 
    '$http', 
    '$state', 
    '$timeout', 
    'growl',
    'user',

    function($scope, $http, $state, $timeout, growl, user) {

      $scope.tabs = [
        { 
          label: "Home",
          className : "link homelink",
          active: true
        },
        { 
          label: "Why Us",
          className : "link whyus",
          active: false
        },
        { 
          label: "Partners",
          className : "link partners",
          active: false
        },
        { 
          label: "Blog",
          className : "link blog",
          active: false
        },
        { 
          label: "Contact Us",
          className : "link contactus",
          active: false
        },
        { 
          label: "Login",
          className : "link login",
          active: false
        }
      ];

      $scope.state = $state;

      $scope.$watch('state', function (newVal, oldVal) {
        if($state.is("intermediate")) {
          $state.go("partner", {}, {location: 'replace'});
        }
        else if($state.is("partner")) {
          $state.go("partner.createQuestion", {}, {location: 'replace'});
        }
      });

      $scope.logout = user.logout;

      $scope.activated = function(index){
        $scope.tabs.forEach(function(tab, i){
          if(index === i){
            tab.active = true;
          }
          else {
            tab.active = false;
          }
        });
      };

      $scope.isLoading = false;
      $scope.isSucceeded = !!user.info.username;

      $scope.reset = function() {
        $scope.username = "";
        $scope.password = "";
      };

      $scope.reset();

      $scope.doLogin = function() {
        if(!$scope.username && !$scope.password) {
          _showMessage("Oops! You forgot to type in your Credentials.");
          return;
        }
        if(!$scope.username) {
          _showMessage("Oops! You forgot to type in the Username.");
          return;
        }
        if(!$scope.password) {
          _showMessage("Oops! You forgot to type in the Password.");
          $scope.loginError.show = true;
          return;
        }
        $scope.isLoading = true;
        user.login($scope.username, $scope.password)
          .then(function(response) {
            $scope.isLoading = false;
            $scope.isSucceeded = true;
            $state.go('intermediate', {}, {location: 'replace'});
            growl.addSuccessMessage("Welcome " + response.data.username);
          })
          ['catch'](function(rejection) {
            _showMessage(rejection.data);
            $scope.isLoading = false;
            $scope.reset();
          });
      };

      function _showMessage(message){
        $scope.loginError.message = message;
        $scope.loginError.show = true;
        $timeout(function(){
          $scope.loginError.message = "";
          $scope.loginError.show = false;
        }, 3000);
      }

      $scope.loginError = {
        message : "Oops! Something is looking wrong",
        show : false
      };

      $scope.sliderBlocks = [
        {
          isActive :true,
          content : "ext/home/slide1.html"
        },
        {
          isActive :false,
          content : "ext/home/slide2.html"
        },
        {
          isActive :false,
          content : "ext/home/slide3.html"
        }
      ];

      $scope.counter = 1;

      $scope.onTimeout = function(){
          $scope.sliderBlocks.forEach(function(block , i){
            if(i === $scope.counter){
              $scope.sliderBlocks[i].isActive = true;
            }
            else {
              $scope.sliderBlocks[i].isActive = false;
            }
          });

          if($scope.counter === 2){
            $scope.counter = 0;
          }
          else{
            $scope.counter++;
          }
          
          mytimeout = $timeout($scope.onTimeout,4000);
      };
      
      var mytimeout = $timeout($scope.onTimeout,4000);


    }
  ]
)

.controller('createQuestionCtrl', 
  [
    '$scope', 
    '$http', 
    '$state', 
    '$timeout', 
    'growl',
    'user',

    function($scope, $http, $state, $timeout, growl, user) {
      $scope.questionLabels = [];
      $scope.questions = [];

      $scope.setDesc = {
        category : "",
        subcategory : "",
        setname : "",
        createdby : ""
      };

      $scope.clearQuestion = function(index){
        $scope.questions[index-1].questionDesc = "";
        $scope.questions[index-1].options[0].label = "";
        $scope.questions[index-1].options[1].label = "";
        $scope.questions[index-1].options[2].label = "";
        $scope.questions[index-1].options[3].label = "";
      };

      function _isQuestionIncomplete(index){
        var ques = $scope.questions[index];
        if(ques.questionDesc.length === 0 || ques.options[0].label.length === 0 || ques.options[1].label.length === 0 || ques.options[2].label.length === 0 || ques.options[3].label.length === 0){
          return true;
        }
        else{
          return false;
        }
          
      }

      $scope.setLength = 24;

      $scope.gotoQuestion = function (index) {
        if(index < $scope.setLength){
          var i = $scope.selectedQuestion.sequence -1;
          if(!_isQuestionIncomplete(i)){
            $scope.questionLabels[i].labelClass = "label-success";
          }
          $scope.selectedQuestion = $scope.questions[index];
        }
      };


      
      _setQuestionsLabels($scope.setLength);

      function _setQuestionsLabels(length){
        for(i = 0; i < length; i++){
          var label = {};
          label.sequence = "Qestion "+(i+1);
          label.labelClass = "label-info";
          $scope.questionLabels.push(label);

          var question = {
            sequence: i+1,
            questionDesc : "",
            options : [
             {label:"", correct :true},
             {label:"", correct :false},
             {label:"", correct :false},
             {label:"", correct :false}
            ]
          };

          $scope.questions.push(question);
        }
      }

      $scope.changeCorrectOption = function (optionIndex,questionIndex) {
        $scope.questions[questionIndex - 1].options.forEach(function(option,i){
          if(optionIndex === (i+1)){
            $scope.questions[questionIndex - 1].options[i].correct = true;
          }
          else{
            $scope.questions[questionIndex - 1].options[i].correct = false;
          }
        });
      };

      $scope.set = {
        questions : $scope.questions,
        name : $scope.setDesc.setname,
        category : $scope.setDesc.category,
        subcategory : $scope.setDesc.subcategory,
        createdby : $scope.setDesc.createdby
      };

      $scope.questions[0] = {
            sequence: 1,
            questionDesc : "",
            options : [
             {label:"", correct :true},
             {label:"", correct :false},
             {label:"", correct :false},
             {label:"", correct :false}
            ]
          };

      $scope.selectedQuestion = $scope.questions[0];
      

    }
  ]
)

;
