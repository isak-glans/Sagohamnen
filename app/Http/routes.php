<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'AngularController@serveApp');

Route::auth();

Route::get('/home', 'HomeController@index');

Route::group(['prefix' => 'api/', 'middleware' => 'auth'], function () {
  Route::get('admin', function() {
    echo "Authenticated...";
  });
});
Route::group(['prefix' => 'api/'], function () {
	Route::get('campaigns', 'CampaignController@all');
	Route::get('campaign/{slug}', 'CampaignController@single');
});


//Route::get('api/campaign', 'CampaignController@all');


/*Route::group(['prefix' => 'api/', 'middleware' => 'auth:api'], function () {
	// Only authenticated users call this api
	/*Route::get('rpg/{id}', [
	    'middleware' => 'auth',
	    'uses' => 'RpgController@init'
	]);
});*/
