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