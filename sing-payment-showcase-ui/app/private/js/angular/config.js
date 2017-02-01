var Config = function(){
    var pre = {
        protocol : 'http://',
        domain : 'localhost',
        port : '8081'
    };
    function mergeUrl(){
        return pre.protocol + pre.domain + ':' + pre.port + '/';
    }
    
    return {
		savePayment:function(){return mergeUrl() + "sing-payment-showcase/Paypal/creditCardPayment"},
		saveBarintreePayment:function(){return mergeUrl() + "sing-payment-showcase/BrainTree/baintreePayment"},
		findPayment:function(key){return mergeUrl() + "sing-payment-showcase/checkPayment/check/"+key+""},
		resetPaymentCache:function(){return mergeUrl() + "sing-payment-showcase/checkPayment/resetData"},
		getToken:function(){return mergeUrl() + "sing-payment-showcase/BrainTree/baintreeToken"}
        
    }
}