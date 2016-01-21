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
  Route::get('{model}/{id}/_checkout',  'Api\v1\ApiController@checkout');
  Route::get('{model}/{id}/_checkin',   'Api\v1\ApiController@checkin');
  Route::get('_checkinAll',             'Api\v1\ApiController@checkinAll');
  Route::get('_checkAccess/{role}',     'Api\v1\ApiController@checkAccess');

  //user routes
  Route::patch('Profile/{id}/resetPassword', 'Api\v1\ProfileController@resetPassword');
  Route::patch('Profile/{id}',      'Api\v1\ProfileController@update');

  // bi routes
  Route::delete('Server',           'Api\v1\ServerController@destroyMany');
  Route::patch('Server/_massUpdate', 'Api\v1\ServerController@markServers');
  Route::resource('Server',         'Api\v1\ServerController');

  Route::delete('Database',           'Api\v1\DatabaseController@destroyMany');
  Route::patch('Database/_massUpdate', 'Api\v1\DatabaseController@markDatabases');
  Route::resource('Database',         'Api\v1\DatabaseController');

  Route::delete('Application',           'Api\v1\ApplicationController@destroyMany');
  Route::patch('Application/_massUpdate', 'Api\v1\ApplicationController@markApplications');
  Route::resource('Application',          'Api\v1\ApplicationController');

  // gis routes
  Route::delete('Document',                 'Api\v1\DocumentController@destroyMany');
  Route::resource('Document',               'Api\v1\DocumentController');

  // admin routes
  Route::patch('User/{id}/resetPassword/','Api\v1\UserController@resetPassword');
  Route::delete('User',                   'Api\v1\UserController@destroyMany');
  Route::resource('User',                 'Api\v1\UserController');

  Route::delete('Group',                  'Api\v1\GroupController@destroyMany');
  Route::resource('Group',                'Api\v1\GroupController');

  Route::delete('Person',                 'Api\v1\PersonController@destroyMany');
  Route::resource('Person',               'Api\v1\PersonController');

  Route::delete('Role',                 'Api\v1\RoleController@destroyMany');
  Route::resource('Role',               'Api\v1\RoleController');
});

/**
 * Admin Routes
 */
Route::group(['prefix' => 'admin'], function(){
  Route::resource('people', 'Admin\PersonController', [ 'only' => [ 'index','show'] ]);
  Route::resource('users',  'Admin\UserController', [ 'only' => [ 'index','show'] ]);
  Route::resource('groups', 'Admin\GroupController', [ 'only' => [ 'index','show'] ]);
  Route::resource('roles',   'Admin\RoleController', [ 'only' => [ 'index','show'] ]);
});

/**
 * User Routes
 */


/**
 * GIS Routes
 */
 Route::group(['prefix' => 'gis'], function(){
   Route::resource('documents',   'GIS\DocumentController' , [ 'only' => [ 'index','show'] ]);
 });

 /**
  * BI Routes
  */
 Route::group(["prefix" => 'bi'], function(){
   Route::resource('servers',       'BI\ServerController', [ 'only' => [ 'index','show'] ] );
   Route::resource('applications',  'BI\ApplicationController', [ 'only' => [ 'index', 'show'] ] );
   Route::resource('databases',     'BI\DatabaseController', [ 'only' => [ 'index', 'show'] ] );
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
