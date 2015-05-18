var phonecatControllers = angular.module('customerControllers', []);

phonecatControllers.controller('CustomerListCtrl', function ($scope, $http) {
  $http.get('/allCustomers').success(function(data) {
	  $scope.users = data; 
  });
  $scope.submitMyForm=function(){
      /* while compiling form , angular created this object*/
      var formData=$scope.cust; 
      /* post to server*/
      $http.post('/addCustomer', formData).success(function(data, status, headers, config) {
    	  $scope.users.push( formData);
    	  $scope.name='';
    	  $scope.account='';
    	  $scope.number='';
    	  $scope.street='';
    	  $scope.town='';
    	  $scope.postcode='';
    	  }).
    	  error(function(data, status, headers, config) {
    	    // called asynchronously if an error occurs
    	    // or server returns response with an error status.
    	  });
     
  }
});