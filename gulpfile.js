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

  var vendor_path = './vendor';

  var paths = {
    jquery : vendor_path + '/components/jquery',
    bootstrap : vendor_path + '/twbs/bootstrap-sass/assets',
    fontAwesome : vendor_path + '/components/font-awesome',
    bootstrapDatetimepicker : vendor_path + '/components/bootstrap-datetimepicker',
    bootbox : vendor_path + '/components/bootbox',
    modernizr : vendor_path + '/components/modernizr',
    underscore : vendor_path + '/ingenious/underscore',
    asyncGrid : vendor_path + '/ingenious/async-grid',
    bootstrapMultiselect : vendor_path + '/ingenious/bootstrap-multiselect',
    classie : vendor_path + '/ingenious/classie',
    jqueryBootpag : vendor_path + '/ingenious/jquery-bootpag',
    jqueryMd5 : vendor_path + '/ingenious/jquery-md5',
    jqueryValidator : vendor_path + '/ingenious/jquery-validator',
    tokenInput : vendor_path + '/ingenious/jquery-tokeninput',
    perfectScrollbar : vendor_path + '/ingenious/perfect-scrollbar',
    bootstrapSlider : vendor_path + '/seiyria/bootstrap-slider',
    noty : vendor_path + '/needim/noty',
    metismenu : vendor_path + '/onokumus/metismenu',
    moment : vendor_path + '/moment/moment',
    historyjs : vendor_path + '/ingenious/history.js',
  }

  var jsPaths = {
    jquery : paths.jquery, // done
    bootstrap : paths.bootstrap + '/javascripts', // done
    bootstrapDatetimepicker : paths.bootstrapDatetimepicker + '/js', // done
    bootbox : paths.bootbox, // done
    modernizr : paths.modernizr, // done
    underscore : paths.underscore, // done
    asyncGrid : paths.asyncGrid + '/js', //done
    bootstrapMultiselect : paths.bootstrapMultiselect + '/dist/js', // done
    classie : paths.classie, // done
    jqueryBootpag : paths.jqueryBootpag + '/lib', // done
    jqueryMd5 : paths.jqueryMd5, // done
    jqueryValidator : paths.jqueryValidator, // done
    tokenInput : paths.tokenInput + '/src', // done
    perfectScrollbar : paths.perfectScrollbar + '/dist/js', // done
    bootstrapSlider : paths.bootstrapSlider + '/js', // done
    noty : paths.noty + '/js/noty/packaged', // done
    metismenu : paths.metismenu + '/dist', // done
    moment : paths.moment, // done
    historyjs : paths.historyjs + '/scripts/bundled/html4+html5', // done
  }

  var jsScripts = [
    jsPaths.jquery + '/jquery.js',
    jsPaths.jquery + '/jquery-migrate.js',
    jsPaths.bootstrap + '/bootstrap.js',
    jsPaths.bootstrapDatetimepicker + '/bootstrap-datetimepicker.js',
    jsPaths.bootbox + '/bootbox.js',
    jsPaths.modernizr + '/modernizr.js',
    jsPaths.underscore + '/underscore.js',
    jsPaths.asyncGrid + '/jstorage.js',
    //jsPaths.asyncGrid + '/jForm.class.js',
    //jsPaths.asyncGrid + '/jInput.class.js',
    // jsPaths.asyncGrid + '/jLinkTable.class.js',
    // jsPaths.asyncGrid + '/jApp.class.js',
    //jsPaths.asyncGrid + '/jGrid.class.js',
    jsPaths.bootstrapMultiselect + '/bootstrap-multiselect.js',
    jsPaths.classie + '/classie.js',
    jsPaths.jqueryBootpag + '/jquery.bootpag.js',
    jsPaths.jqueryMd5 + '/jquery.md5.js',
    jsPaths.jqueryValidator + '/jquery.psiblings.js',
    jsPaths.tokenInput + '/jquery.tokeninput.js',
    //jsPaths.jqueryValidator + '/jquery.validator.js',
    jsPaths.perfectScrollbar + '/perfect-scrollbar.jquery.js',
    jsPaths.bootstrapSlider + '/bootstrap-slider.js',
    jsPaths.noty + '/jquery.noty.packaged.js',
    jsPaths.metismenu + '/metisMenu.js',
    jsPaths.moment + '/moment.js',
    jsPaths.historyjs + '/jquery.history.js',
    '*.js',
    'views/*.js'
  ];

   var cssPaths = [
     paths.bootstrap + '/stylesheets',
     paths.fontAwesome + '/scss',
     paths.bootstrapDatetimepicker + '/css',
     paths.bootstrapMultiselect + '/dist/css',
     paths.perfectScrollbar + '/dist/css',
     paths.bootstrapSlider + '/css',
     paths.metismenu + '/dist',
     paths.tokenInput + '/styles'
   ];

    //scripts
    mix.scripts(jsScripts, 'public/js/all.js');

    //styles
    mix.sass('app.scss',
      'public/css/all.css', {
        includePaths : cssPaths
    });

});
