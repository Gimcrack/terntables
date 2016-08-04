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

/**
 * Admin Routes
 */
Route::group(['prefix' => 'admin', 'middleware' => 'auth_admin'], function(){
  Route::resource('people', 'Admin\PersonController', [ 'only' => [ 'index','show'] ]);
  Route::resource('users',  'Admin\UserController', [ 'only' => [ 'index','show'] ]);
  Route::resource('groups', 'Admin\GroupController', [ 'only' => [ 'index','show'] ]);
  Route::resource('roles',   'Admin\RoleController', [ 'only' => [ 'index','show'] ]);
  Route::resource('notifications',   'Admin\NotificationController', [ 'only' => [ 'index','show'] ]);
  Route::resource('silencedNotifications',   'Admin\SilencedNotificationController', [ 'only' => [ 'index','show'] ]);
  Route::resource('notificationExemptions',   'Admin\NotificationExemptionController', [ 'only' => [ 'index','show'] ]);
  Route::resource('operatingSystems',   'Admin\OperatingSystemController', [ 'only' => [ 'index','show'] ]);
  Route::get('serverAgents/update',     'Admin\ServerAgentController@updateAll' );
  Route::resource('serverAgents',  'Admin\ServerAgentController', [ 'only' => [ 'index','show'] ] );

});

/**
 * User Routes
 */

 /**
  * Metrics Routes
  */
 Route::group(['prefix' => 'metrics'], function() {
   Route::get('tickets/archive/{groupOrIndividual}/{id}/{period}', 'MetricsController@archiveTickets');
   Route::get('tickets/archive/{groupOrIndividual}/{id}',          'MetricsController@archiveTickets');
   Route::get('tickets/archive',                                   'MetricsController@archiveTickets');
   Route::get('tickets/{groupOrIndividual}/{id}',                  'MetricsController@tickets');
   Route::get('tickets',                                           'MetricsController@tickets');
 });


/**
 * GIS Routes
 */
 Route::group(['prefix' => 'gis'], function(){
   Route::resource('documents',   'GIS\DocumentController' , [ 'only' => [ 'index','show'] ]);
   Route::get('documents/{id}/pdf',  'GIS\DocumentController@showpdf');
   Route::get('documents/{id}/raw',  'GIS\DocumentController@showraw');
 });

 /**
  * oit Routes
  */
 Route::group(["prefix" => 'oit', 'middleware' => 'auth'], function(){
   Route::get('servers/health',     'BI\ServerController@healthServers');
   Route::resource('servers',       'BI\ServerController', [ 'only' => [ 'index','show'] ] );
   Route::resource('serverDisks',   'BI\ServerDiskController', [ 'only' => [ 'index','show'] ] );
   Route::resource('sql-servers',   'BI\DatabaseInstanceController', [ 'only' => [ 'index','show'] ] );
   Route::resource('applications',  'BI\ApplicationController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('databases',     'BI\DatabaseController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('outages',       'BI\OutageController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('taskTemplates', 'BI\OutageTaskController', [ 'only' => [ 'index', 'show'] ] );
   Route::get('outageTasks/_generate',   'BI\OutageTaskDetailController@generateTaskDetails');
   Route::resource('outageTasks',   'BI\OutageTaskDetailController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('updates',       'BI\UpdateController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('approveUpdates','BI\UpdateDetailController', [ 'only' => [ 'index', 'show'] ] );

   Route::resource('logs','BI\LogEntryController', [ 'only' => [ 'index', 'show'] ] );

   Route::get('sharepoint', 'PagesController@sharepoint');
 });

//misc
Route::get('/test', function(){
  return view('test.index');
});
Route::get('/', 'PagesController@home');
Route::get('home', 'PagesController@home');

// profile
Route::get('profile',             'ProfileController@index');

/**
 * Authentication
 */

 // AD LOGIN
 Route::get('auth/adlogin/{_token}', 'Auth\AuthController@adlogin');

Route::controllers([
  'auth' => 'Auth\AuthController',
  'password' => 'Auth\PasswordController'
  ]);
