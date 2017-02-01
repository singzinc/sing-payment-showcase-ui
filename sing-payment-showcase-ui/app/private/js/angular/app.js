/*
var singApp = angular.module('singApp', [
	'ngRoute',
	'datatables',
	'dndLists',
	'naif.base64',
	'ngMessages',
	'singAppControllers',
	'bsLoadingOverlay',
	'bsLoadingOverlayHttpInterceptor',
	'ui.bootstrap',
	'singAppServices',
	'credit-cards'
]);
*/


var singApp = angular.module('singApp', [
	'ngRoute',
	'datatables',
	'dndLists',
	'naif.base64',
	'ngMessages',
	'singAppControllers',
	'bsLoadingOverlay',
	'bsLoadingOverlayHttpInterceptor',
	'ui.bootstrap',
	'singAppServices',
	'credit-cards',
	'bootstrapLightbox'
])
.filter('yesNo', function () {
  return function (boolean) {
    return boolean ? 'Yes' : 'No';
  }
})
;



//singApp.constant('clientTokenPath', 'http://localhost:8081/sing-resttemplate-showcase/BrainTree/baintreeToken2');
 
singApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);


singApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/CreateBraintreePayment',{
				templateUrl: 'private/templates/CreateBraintreePayment.html',
				controller: 'addPayment'
			}).
			when('/CheckPayment',{
				templateUrl: 'private/templates/CheckPayment.html',
				controller: 'checkPayment'
			}).
			when('/CreatePayment',{
				templateUrl: 'private/templates/CreatePayment.html',
				controller: 'addPayment'
			}).
			otherwise({
				templateUrl: 'private/templates/DashBoard.html'
			});
	}]);