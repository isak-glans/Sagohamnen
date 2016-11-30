
describe('SingeRPGCtrl test', function() {
	var $controller, $scope;
	var rpgService;
	var createSingCtrl;

	// function mockRpgService(){
	// 	var factory = {}

	// 	factory.storeChat(message,campaignId) = function(){
	// 	}
	// 	return factory;
	// }

	beforeEach(function(){
		module('ShApp', function($provide) {
		rpgService = { storeChat: function(){} };
		$provide.value('RpgService', rpgService ); // replace
      });
   	});

	beforeEach(inject(function($injector){
	    // The injector unwraps the underscores (_) from around the parameter names when matching
	    //$controller = _$controller_;
	    $controller = $injector.get('$controller');
	    $scope = $injector.get('$rootScope').$new();
	    createSingCtrl = function(){
	    	return $controller("SingeRPGCtrl", $scope);
	    }
	}));

	it('Detta är ett test', function() {
		var ctrl = createSingCtrl();
		expect(true).toEqual(true);
	});

});

