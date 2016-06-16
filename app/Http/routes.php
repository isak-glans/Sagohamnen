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

Event::listen('illuminate.query', function($query)
{
    var_dump($query);
});


Route::get('/', function () {
    return view('welcome');
});

Route::auth();

Route::get('/home', 'HomeController@index');

Route::group(['prefix' => 'api/', 'middleware' => 'auth'], function () {
  Route::get('campaign', function() {
    echo "Authenticated...";
  });
});


//Route::get('api/campaign', 'CampaignController@all');
Route::get('api/campaign/{slug}', 'CampaignController@single');

/*Route::group(['prefix' => 'api/', 'middleware' => 'auth:api'], function () {
	// Only authenticated users call this api
	/*Route::get('rpg/{id}', [
	    'middleware' => 'auth',
	    'uses' => 'RpgController@init'
	]);
});*/
