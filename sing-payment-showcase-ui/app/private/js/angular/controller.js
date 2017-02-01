var singAppControllers = angular.module('singAppControllers',[]);

	
singAppControllers.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ buttonClicked }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
          scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });

singAppControllers.controller('addPayment',['$http','$scope','$window',
	function($http,$scope, $window,bsLoadingOverlayService){
		var config = new Config();
	
		$scope.showModal = false;
		$scope.buttonClicked = "";
		$scope.toggleModal = function(btnClicked){
				$scope.buttonClicked = btnClicked;
				$scope.showModal = !$scope.showModal;
		};
		

		$http.get(config.getToken()) .then(function(response) {
				$scope.token = response.data.token;
		});

		$scope.saveOrUpdatePayment=function(){
			$scope.payment.token = $scope.token;
		
			//console.log("scope.payment.creditCardNumber" + $scope.payment.creditCardNumber);
	
			console.log("currency : " + $scope.payment.currency);
			console.log(document.getElementById("cardType"));
			var  cardType=angular.element(document.getElementById("cardType"));      
			var  cardTypeValue = cardType.val();
			var paymentGateway = '';
			var error = true;
			if(cardTypeValue == 'American Express' && $scope.payment.currency != 'USD' ){
				error = false;
				$scope.buttonClicked = "Deny";
				$scope.showModal = !$scope.showModal;
				$scope.message= "American Express is possible to use only for USD";
				$scope.statusMsg = "error";
			}
			
			if($scope.payment.currency == 'USD' || $scope.payment.currency == 'EUR' || $scope.payment.currency == 'AUD'){
				paymentGateway = 'paypal';
			}else{
				paymentGateway = 'braintree';
			}
			
			
			if(error && paymentGateway == 'braintree'){
			/*
				$http.get(config.getToken()) .then(function(response) {
					$scope.token = response.data.token;
				});
			*/	
				var client = new $window.braintree.api.Client({clientToken: $scope.payment.token});
				client.tokenizeCard({
				  number: $scope.payment.creditCardNumber,
				  expirationDate: $scope.payment.creditCardExpMon+'/'+$scope.payment.creditCardExpYear
				}, function (err, nonce) {
					var config = new Config();
					console.log("nonce : "+ nonce);
					$scope.payment.nonce = nonce;
					$http({
						url: config.saveBarintreePayment(),
						data: $scope.payment,
						method: 'post',
						dataType: 'json'
					}).then(function(response) {  
						$scope.referCodeMsg= response.data.paymentId ;
						//$scope.paypalPaymentIdMsg =  response.data.paypalPaymentId ;
						$scope.buttonClicked = "Success braintree";
						$scope.statusMsg = "braintree";
						$scope.showModal = !$scope.showModal;
						
					
					}, function(response) {
						  $scope.data = response.data || 'Request failed';
						  $scope.status = response.status;
						  $scope.buttonClicked = "Deny";
						  $scope.showModal = !$scope.showModal;
					});
					
					
					
				});
			}
			
			if(error && paymentGateway == 'paypal'){
				var config = new Config();
				$http({
					url: config.savePayment(),
					data: $scope.payment,
					method: 'post',
					dataType: 'json'
				}).then(function(response) {  
					$scope.referCodeMsg= response.data.paymentId ;
					$scope.paypalPaymentIdMsg =  response.data.paypalPaymentId ;
					$scope.buttonClicked = "Success Paypal";
					$scope.statusMsg = "paypal";
					$scope.showModal = !$scope.showModal;
					
				
				}, function(response) {
					  $scope.data = response.data || 'Request failed';
					  $scope.status = response.status;
					  $scope.buttonClicked = "Deny";
					  $scope.showModal = !$scope.showModal;
				});
			}
		}

	}]);

	
	
singAppControllers.controller('checkPayment',['$http','$scope','$window',
	function($http,$scope, $window,bsLoadingOverlayService){
		var config = new Config();
		
		
		$scope.restCache = function() {
			console.log("reset the cache ");
			var config = new Config();
			$http({
					url: config.resetPaymentCache(),
					method: 'get',
					dataType: 'json'
				}).then(function(response) {  
					console.log(response.data.status);
					if(response.data.status == 'ok'){
						$scope.buttonClicked = "Success";
						$scope.statusMsg = "reset";
					}else{
						$scope.buttonClicked = "Deny";
						$scope.statusMsg = "cannotReset";
					}
					$scope.showModal = !$scope.showModal;
				}, function(response) {
					  $scope.data = response.data || 'Request failed';
					  $scope.status = response.status;
					  $scope.buttonClicked = "Deny";
					  $scope.showModal = !$scope.showModal;
				});
		}
		
		$scope.checkPaymentData=function(){
				var config = new Config();
				//console.log("check");
				//console.log("customer name : " + $scope.payment.customerName);
				//console.log("customer name : " + $scope.payment.referCode);
				var key = $scope.payment.customerName + $scope.payment.referCode;
				console.log(key);
				
				
				$http({
					url: config.findPayment(key),
					data: $scope.payment,
					method: 'get',
					dataType: 'json'
				}).then(function(response) {  
					$scope.referCodeMsg= response.data.paymentId ;
					$scope.paypalPaymentIdMsg =  response.data.paypalPaymentId ;
					//$scope.buttonClicked = "Success";
					if(response.data.singPaymentId != null){
						$scope.buttonClicked = "Success";
						$scope.statusMsg = "ok";
						$scope.paymentResult = response.data;
					}else{
						$scope.buttonClicked = "No Data";
						$scope.statusMsg = "no";
					}
					$scope.showModal = !$scope.showModal;
				}, function(response) {
					  $scope.data = response.data || 'Request failed';
					  $scope.status = response.status;
					  $scope.buttonClicked = "Deny";
					  $scope.showModal = !$scope.showModal;
				});
				
		}
	}]);
