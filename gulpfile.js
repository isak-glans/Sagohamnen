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

    // Copy files
    elixir(function(mix) {
        mix.copy('bower_components/fontawesome/fonts', 'public/assets/fonts');
    });

    // It looks in folder resources/assets/sass
    mix.sass([
        '**/*.scss',
        '../../../bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss',
        '../../../bower_components/font-awesome/scss/font-awesome.scss',
        '../../../bower_components/bootstrap-social/bootstrap-social.css',
    ], 'public/assets/css/app.css');

    /*'../../../bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss',*/

    // Looks in folder: resources/assets/js/
    mix.scripts([
    	'../../../bower_components/angular/angular.min.js',
    	'../../../bower_components/angular-route/angular-route.min.js',
        '../../../bower_components/jquery/dist/jquery.min.js',
        '../../../bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
       	'scripts/app.js',
        'scripts/controllers/MainController.js',
       	'scripts/controllers/CampaignController.js',
       	'scripts/services/UserService.js',
        'scripts/services/DbService.js'
    ], 'public/assets/js/app.js');

    /*
	'../../../node_modules/angular/angular.min.js',
    '../../../node_modules/angular-route/angular-route.min.js',*/

});

