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