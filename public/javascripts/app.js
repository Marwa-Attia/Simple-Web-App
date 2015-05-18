
var webApp = angular.module('webApp', [
  'ngRoute',
  'customerControllers'
]);

webApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/addCustomer', {
        templateUrl: 'assets/partials/addCustomer.html',
        controller: 'AddCustomerCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);