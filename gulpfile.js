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
        mix.copy('bower_components/font-awesome-sass/assets/fonts', 'public/assets/fonts');
    });

    // It looks in folder resources/assets/sass
    mix.sass([
        '../../../bower_components/angular-material/angular-material.scss',
        '**/*.scss',
        //'../../../bower_components/bootstrap/dist/css/bootstrap.min.css',
        '../../../bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss',
        //'../../../bower_components/font-awesome-sass/assets/stylesheets/_font-awesome.scss',
        //'../../../bower_components/bootstrap-social/bootstrap-social.scss',
    ], 'public/assets/css/app.css');



    // Looks in folder: resources/assets/js/
    mix.scripts([
    	'../../../bower_components/angular/angular.js',
        '../../../bower_components/angular-resource/angular-resource.js',
    	'../../../bower_components/angular-route/angular-route.js',
        '../../../bower_components/angular-sanitize/angular-sanitize.js',
        '../../../bower_components/jquery/dist/jquery.js',
        '../../../bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
        '../../../bower_components/angular-aria/angular-aria.js',
        '../../../bower_components/angular-animate/angular-animate.js',
        '../../../bower_components/angular-material/angular-material.js',
        //'../../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        // '../../../bower_components/angular-bootstrap/ui-bootstrap.min.js',

        //'../../../bower_components/bootstrap/dist/js/bootstrap.min.js',
        //'../../../bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
       	'scripts/**/*.js',
        /*'scripts/controllers/MainController.js',
       	'scripts/controllers/CampaignController.js',
       	'scripts/services/UserService.js',
        'scripts/services/DbService.js'*/
    ], 'public/assets/js/app.js');

    /*
	'../../../node_modules/angular/angular.min.js',
    '../../../node_modules/angular-route/angular-route.min.js',*/

});

