var elixir = require('laravel-elixir');

elixir(function(mix) {

    mix.copy('bower_components/font-awesome-sass/assets/fonts', 'public/assets/fonts');

    // Compile the SASS files
    mix.sass([
        '../../../bower_components/angular-material/angular-material.scss',
        '**/*.scss',
        //'../../../bower_components/bootstrap/dist/css/bootstrap.min.css',
        '../../../bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss',
        //'../../../bower_components/font-awesome-sass/assets/stylesheets/_font-awesome.scss',
        //'../../../bower_components/bootstrap-social/bootstrap-social.scss',
        //'../../../bower_components/angular-bootstrap/ui-bootstrap.csp.css'
    ], 'public/assets/css/sass-bundle.css');

    mix.styles([
        // This file are for styling selection options and more.
        '../../../bower_components/angular-ui-select/dist/select.min.css',
        '../../../public/assets/css/sass-bundle.css'
    ],'public/assets/css/app.css');

    // Vendor scripts
    mix.scripts([
    	'angular/angular.js',
        'angular-resource/angular-resource.js',
    	'angular-route/angular-route.js',
        'angular-sanitize/angular-sanitize.js',
        'jquery/dist/jquery.js',
        'bootstrap-sass/assets/javascripts/bootstrap.js',
        'angular-aria/angular-aria.js',
        'angular-animate/angular-animate.js',
        'angular-material/angular-material.js',
        'angular-scroll-glue/src/scrollglue.js',
        'angular-bootstrap/ui-bootstrap-tpls.min.js',
        'angular-ui-select/dist/select.min.js',
    ], 'public/assets/js/vendors.js', 'bower_components/');

    mix.scripts([
        'scripts/**/*.js'
    ], 'public/assets/js/sagohamnen.js');

    // Compress script for production.
    if (elixir.config.production) {
        mix.scripts([
            'sagohamnen.js',
            'vendors.js',
        ], 'public/assets/js/sagohamnen_build.js', 'public/assets/js/');
    }

});



