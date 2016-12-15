angular.module('ShApp')

.factory('UserService', function($rootScope, $resource, $location, SessionFactory) {
	console.log("UserService läses in.");
	var vm = {};
	vm.csrf = "";
	vm.currentUser = {name : "", id: 0, loggedIn : false };

	var User = $resource('/api/user/:id',{},{
		setupEditUser : {method: "GET", url: "/api/user/:id/edit"},
    	updateA : {method: "PUT", url: "/api/user/:id"},
    	loadUser : {method : "GET", url: '/api/username_and_id' },
    	logIn : {method : "GET", url: '/api/username_and_id' },
    	logOut : {method : "GET", url: '/logout' }
	});

	vm.checkIfLoggedIn = function(currentPage) {
		console.log("INne i checkIfLoggedIn");
		// User logged in?
		if (! vm.currentUser.loggedIn) {
			console.log("Userserives säger att jag inte är inloggad.");
			// If not check Localstorage.
			if ( !!SessionFactory.getKey('userId') ) {
				console.log("currentUser not logged in but getting from local session.");
				// Here I am using local session, because
				// if user refresh a page, all service data
				// will be lost. But local session will remain
				// until user close tab/browser.
				vm.currentUser.id = SessionFactory.getKey('userId');
				vm.currentUser.name = SessionFactory.getKey('userName');
				vm.currentUser.loggedIn = true;
				console.log(vm.currentUser);
			// If recently logged in the user will
			// be directed to index, which means
			// current page will be empty.
			} else if (currentPage == '') {
				console.log("Now ask server");
				// Only ask the server for authentication
				// when user asks to log in.
				ask_server_if_user_logged_in();
			}
		} else {
			console.log("My id "+ vm.currentUser.id);
		}

		// Always update the user menu for each page load.
		updateUserMenu();
	}

	vm.setUser = function(user){
		vm.currentUser = user;
	}

	vm.logout = function() {
		console.log("Loggar ut");
		User.logOut({}, function(response){
			console.log("User have been logged out on server.");
			vm.setLogout();
			updateUserMenu();
			$location.path("/home");
		});
	};

	// Call this when user get a 403.
	vm.setLogout = function() {
		vm.currentUser.id = 0;
        vm.currentUser.name = "";
        vm.currentUser.loggedIn = false;
		if ( !!SessionFactory.getKey('userId') && !!SessionFactory.getKey('userName')) {
			SessionFactory.deleteKey('userId');
            SessionFactory.deleteKey('userName');
		}
	}

	/* ========================================
			Private methods
	   ======================================= */

	function ask_server_if_user_logged_in(){
		console.log("Asking server.");
		User.loadUser().$promise.then(function(response){
			console.log("Serverser responded", response);
			// Check if missing JSON columns.
			if (!response.hasOwnProperty('name') || !response.hasOwnProperty('id')
				|| !response.hasOwnProperty('signed_in')) {
				$location.path("/500");
			}

            // Signed in?
            if (response.signed_in){
            	console.log("Nu sätts currentUser");
            	// Save user in local session.
            	vm.currentUser.name = response.name;
            	vm.currentUser.id = response.id;
            	vm.currentUser.loggedIn = true;
            	SessionFactory.setKey('userId', response.id);
            	SessionFactory.setKey('userName', response.name);
            } else {
            	// User not logged in.
            	vm.setLogout();
            }
            // Update view
            updateUserMenu();
        }, function(error) {
        	console.log(error);
        });
	}

	function updateUserMenu()
	{
		$rootScope.$broadcast('loginChange', {});
	}

	return vm;

});