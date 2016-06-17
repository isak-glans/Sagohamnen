var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {

    /*mix.sass('app.scss')
    	.version('css/app.css');*/

    // It looks in folder resources/assets/sass
    mix.sass([
        '**/*.scss'
    ], 'public/assets/css/app.css');

    mix.scripts([
    	'../../../node_modules/angular/angular.min.js',
    	'../../../node_modules/angular-route/angular-route.min.js',
       	'scripts/app.js',
       	'scripts/controllers/CampaignController.js',
       	'scripts/services/DbService.js'
    ], 'public/assets/js/app.js');

    /*
	'../../../node_modules/angular/angular.min.js',
    '../../../node_modules/angular-route/angular-route.min.js',*/

});

