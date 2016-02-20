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
 * API Routes
 */
Route::group(['prefix' => 'api/v1'], function() {
  //helper routes
  Route::get('{model}/_selectOptions/{options}_{labels}', 'Api\v1\ApiController@getSelectOptions');
  Route::get('{model}/_tokenOptions/{options}_{labels}',  'Api\v1\ApiController@getTokensOptions');
  Route::get('{model}/_getPermissions', 'Api\v1\ApiController@getPermissions');
  Route::get('{model}/_checkedOut',     'Api\v1\ApiController@getCheckedOutRecords');
  Route::get('{model}/_checkinAll',     'Api\v1\ApiController@checkinAll');
  Route::get('{model}/{id}/_checkout',  'Api\v1\ApiController@checkout');
  Route::get('{model}/{id}/_checkin',   'Api\v1\ApiController@checkin');
  Route::get('{model}/{id}/_inspect',   'Api\v1\ApiController@inspect');

  Route::get('_checkinAll',             'Api\v1\ApiController@checkinAll');
  Route::get('_checkAccess/{role}',     'Api\v1\ApiController@checkAccess');

  Route::get('AD/User', 'Api\v1\ActiveDirectoryController@index');
  Route::get('AD/User/{id}', 'Api\v1\ActiveDirectoryController@show');

  //user routes
  Route::get('Profile',                 'Api\v1\ProfileController@index');
  Route::get('Profile/{id}',            'Api\v1\ProfileController@show');
  Route::patch('Profile/resetPassword', 'Api\v1\ProfileController@resetPassword');
  Route::patch('Profile/{id}',          'Api\v1\ProfileController@update');

  // oit routes
  Route::delete('Server',           'Api\v1\ServerController@destroy');
  Route::patch('Server/_massUpdate', 'Api\v1\ServerController@markServers');
  Route::resource('Server',         'Api\v1\ServerController');

  Route::delete('Database',           'Api\v1\DatabaseController@destroy');
  Route::patch('Database/_massUpdate', 'Api\v1\DatabaseController@markDatabases');
  Route::resource('Database',         'Api\v1\DatabaseController');

  Route::delete('Application',           'Api\v1\ApplicationController@destroy');
  Route::patch('Application/_massUpdate', 'Api\v1\ApplicationController@markApplications');
  Route::resource('Application',          'Api\v1\ApplicationController');

  Route::delete('Outage',           'Api\v1\OutageController@destroy');
  Route::patch('Outage/_massUpdate', 'Api\v1\OutageController@markOutages');
  Route::resource('Outage',          'Api\v1\OutageController');

  Route::delete('OutageTask',             'Api\v1\OutageTaskController@destroy');
  Route::patch('OutageTask/_massUpdate',  'Api\v1\OutageTaskController@markOutageTasks');
  Route::resource('OutageTask',           'Api\v1\OutageTaskController');

  Route::delete('OutageTaskDetail',             'Api\v1\OutageTaskDetailController@destroy');
  Route::patch('OutageTaskDetail/_massUpdate',  'Api\v1\OutageTaskDetailController@markOutageTasks');
  Route::resource('OutageTaskDetail',           'Api\v1\OutageTaskDetailController');

  // gis routes
  Route::delete('Document',                 'Api\v1\DocumentController@destroy');
  Route::resource('Document',               'Api\v1\DocumentController');

  // admin routes
  Route::patch('User/{id}/resetPassword/','Api\v1\UserController@resetPassword');
  Route::delete('User',                   'Api\v1\UserController@destroy');
  Route::resource('User',                 'Api\v1\UserController');

  Route::delete('Group',                  'Api\v1\GroupController@destroy');
  Route::resource('Group',                'Api\v1\GroupController');

  Route::patch('Person/_massUpdate',      'Api\v1\PersonController@massUpdate');
  Route::delete('Person',                 'Api\v1\PersonController@destroy');
  Route::resource('Person',               'Api\v1\PersonController');

  Route::delete('Role',                 'Api\v1\RoleController@destroy');
  Route::resource('Role',               'Api\v1\RoleController');

  Route::delete('OperatingSystem',                 'Api\v1\OperatingSystemController@destroy');
  Route::resource('OperatingSystem',               'Api\v1\OperatingSystemController');
});

/**
 * Admin Routes
 */
Route::group(['prefix' => 'admin'], function(){
  Route::resource('people', 'Admin\PersonController', [ 'only' => [ 'index','show'] ]);
  Route::resource('users',  'Admin\UserController', [ 'only' => [ 'index','show'] ]);
  Route::resource('groups', 'Admin\GroupController', [ 'only' => [ 'index','show'] ]);
  Route::resource('roles',   'Admin\RoleController', [ 'only' => [ 'index','show'] ]);
  Route::resource('operatingSystems',   'Admin\OperatingSystemController', [ 'only' => [ 'index','show'] ]);
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
 Route::group(["prefix" => 'oit'], function(){
   Route::resource('servers',       'BI\ServerController', [ 'only' => [ 'index','show'] ] );
   Route::resource('applications',  'BI\ApplicationController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('databases',     'BI\DatabaseController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('outages',       'BI\OutageController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('taskTemplates', 'BI\OutageTaskController', [ 'only' => [ 'index', 'show'] ] );
   Route::get('outageTasks/_generate',   'BI\OutageTaskDetailController@generateTaskDetails');
   Route::resource('outageTasks',   'BI\OutageTaskDetailController', [ 'only' => [ 'index', 'show'] ] );

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
