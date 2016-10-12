<?php

Route::auth();

Event::listen('Illuminate\Database\Events\QueryExecuted', function ($query) {
    /*var_dump($query->sql);
    var_dump($query->bindings);
    var_dump($query->time);*/
});

Route::get('blogrep', function() {
	new \Sagohamnen\Campaign\Campaign_repository;
});

// API
Route::group(['prefix' => 'api/'], function () {
	Route::resource('campaign', 'CampaignController', ['except' => ['store', 'update', 'edit']]);
	Route::resource('campaign_user', 'CampaignUserController', ['except' => ['store', 'update', 'edit']]);
	Route::get('campaigns_per_page/{page_nr}', 'CampaignController@campaigns_per_page');
	Route::get('identify_campaign/{campaign_id}', 'CampaignController@identify');
	Route::resource('user', "UserController", ['except' => ['store', 'update', 'edit']]);
	Route::get('mytoken', function(){
		$result = array( 'token' => csrf_token() );
		return response()->json( $result );
	});
	Route::get('username_and_id', function() {
		$result = new stdClass();
		$result->signed_in = false;

		if (Auth::check()) :
			$result->name = Auth::user()->name;
			$result->id = Auth::user()->id;
			$result->signed_in = true;
			//$name = Auth::user()->name;
		endif;

		return response()->json( $result );
	});
	Route::resource('chronicle', 'ChronicleController', ['except' => ['store', 'update', 'edit']]);
	Route::resource('character', 'CharacterController', ['except' => ['store', 'update', 'edit']]);
	Route::get('campaign/{campaign_id}/page/{page_nr}', 'ChronicleController@chronicles_per_page');
	Route::post('portraits', 'PortraitController@index');
	Route::get('apa', 'MediaController@apa');
});

// API: Signed in users
Route::group(['prefix' => 'api/', 'middleware' => 'auth'], function () {
	//Route::resource('campaigns', 'CampaignController');
	Route::resource('campaign', 'CampaignController', ['only' => ['store', 'update', 'edit']]);
	Route::resource('campaign_user', 'CampaignUserController', ['only' => ['store', 'update', 'edit']]);
	Route::get('camp_applications_setup/{campaign_id}', 'CampaignController@campaignApplication_setup');
	Route::get('apply_to_campaign/{campaign_id}', 'CampaignController@apply_to_campaign' );
	Route::resource('user', "UserController", ['only' => ['store', 'update', 'edit']]);
	Route::resource('character', 'CharacterController', ['only' => ['store', 'update', 'edit']]);
	Route::get('character/{id}/leave_campaign', 'CharacterController@leave_campaign');
	Route::get('character/{id}/set_status/{status}', 'CharacterController@set_status');
	Route::get('admin', function() {
		echo "Authenticated...";
	});
	Route::post('admin', function() {
		echo "Authenticated...";
	});
	Route::resource('chronicle', 'chronicleController', ['only' => ['store', 'update', 'edit']]);
});

Route::get('/redirect', 'SocialAuthController@redirect');
Route::get('/callback', 'SocialAuthController@callback');

Route::get('/index', function() {
	return view('index');
});

Route::get('/', function() {
	return view('index');
});

