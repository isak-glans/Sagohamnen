<?php

Route::auth();

// API
Route::group(['prefix' => 'api/'], function () {
	Route::resource('campaigns', 'CampaignController', ['except' => ['store', 'update', 'edit']]);
	Route::get('mytoken', function(){

		$result = array( 'token' => csrf_token() );
		return response()->json( $result );
	});
	Route::get('username', function() {
		if ( isset( Auth::user()->name ) ) :
			$name = Auth::user()->name;
		else:
			$name = '';
		endif;

		return response()->json( $name );
	});
});

// API: Signed in users
Route::group(['prefix' => 'api/', 'middleware' => 'auth'], function () {
	//Route::resource('campaigns', 'CampaignController');
	Route::resource('campaigns', 'CampaignController', ['only' => ['store', 'update', 'edit']]);
	Route::get('admin', function() {
		echo "Authenticated...";
	});
	Route::post('admin', function() {
		echo "Authenticated...";
	});
});

Route::get('/redirect', 'SocialAuthController@redirect');
Route::get('/callback', 'SocialAuthController@callback');

Route::get('/index', function() {
	return view('index');
});

Route::get('/', function() {
	return view('index');
});

