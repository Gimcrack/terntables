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


// api

Route::group(['prefix' => 'api/1.0'], function() {
  Route::get('bi/servers',      'Api\v1_0\ApiController@servers');
  Route::get('bi/databases',    'Api\v1_0\ApiController@databases');
  Route::get('bi/applications', 'Api\v1_0\ApiController@applications');
});

/**
 * User Routes
 */


//misc
Route::get('/test', function(){
  return view('test.index');
});
Route::get('/', 'PagesController@home');
Route::get('home', 'PagesController@home');

// profile
Route::get('profile', 'ProfileController@index');
Route::get('users/json', 'ProfileController@indexjson');
Route::patch('users/{id}', 'ProfileController@update');
Route::patch('resetPassword/{id}', 'ProfileController@resetPassword');

// documents
Route::get('documents/json',      'DocumentController@indexjson');
Route::get('documents/{id}/json', 'DocumentController@showjson');
Route::get('documents/{id}/pdf',  'DocumentController@showpdf');
Route::get('documents/{id}/raw',  'DocumentController@showraw');
Route::delete('documents',        'DocumentController@destroyMany');
Route::resource('documents',      'DocumentController');

// bi - servers
Route::get('bi/servers/json',         'BI\ServerController@indexjson');
Route::get('bi/servers/{id}/json',    'BI\ServerController@showjson');
Route::delete('bi/servers',           'BI\ServerController@destroyMany');
Route::patch('bi/servers/massUpdate', 'BI\ServerController@markServers');
Route::resource('bi/servers',         'BI\ServerController');

// bi - applications
Route::get('bi/applications/json',         'BI\ApplicationController@indexjson');
Route::get('bi/applications/{id}/json',    'BI\ApplicationController@showjson');
Route::delete('bi/applications',           'BI\ApplicationController@destroyMany');
Route::patch('bi/applications/massUpdate', 'BI\ApplicationController@markApplications');
Route::resource('bi/applications',         'BI\ApplicationController');

// bi - databases
Route::get('bi/databases/json',         'BI\DatabaseController@indexjson');
Route::get('bi/databases/{id}/json',    'BI\DatabaseController@showjson');
Route::delete('bi/databases',           'BI\DatabaseController@destroyMany');
Route::patch('bi/databases/massUpdate', 'BI\DatabaseController@markDatabases');
Route::resource('bi/databases',         'BI\DatabaseController');

// pages
Route::get('selopts/_{model}_{options}_{labels}', 'PagesController@optionsjson');
Route::get('tokenopts/_{model}_{options}_{labels}', 'PagesController@tokensjson');
Route::get('checkout/_{model}_{id}', 'PagesController@checkout');
Route::get('checkedout/_{model}', 'PagesController@getCheckedOutRecords');
Route::get('checkin/_{model}_{id}', 'PagesController@checkin');
Route::get('checkin/all', 'PagesController@checkinAll');
Route::get('checkAccess/{role}', 'PagesController@checkAccess');
Route::get('getPermissions/{model}', 'PagesController@getPermissions');

/**
 * Admin Routes
 */


 // people
 Route::get('admin/people/json',      'Admin\PersonController@indexjson');
 Route::get('admin/people/{id}/json', 'Admin\PersonController@showjson');
 Route::delete('admin/people',        'Admin\PersonController@destroyMany');
 Route::resource('admin/people',      'Admin\PersonController');

 // users
 Route::get('admin/users/json',      'Admin\UserController@indexjson');
 Route::get('admin/users/{id}/json', 'Admin\UserController@showjson');
 Route::patch('admin/resetPassword/{id}', 'Admin\UserController@resetPassword');
 Route::delete('admin/users',        'Admin\UserController@destroyMany');
 Route::resource('admin/users',      'Admin\UserController');


 // groups
 Route::get('admin/groups/json',      'Admin\GroupController@indexjson');
 Route::get('admin/groups/{id}/json', 'Admin\GroupController@showjson');
 Route::delete('admin/groups',        'Admin\GroupController@destroyMany');
 Route::resource('admin/groups',      'Admin\GroupController');

 // modules
 Route::get('admin/modules/json',      'Admin\ModuleController@indexjson');
 Route::get('admin/modules/{id}/json', 'Admin\ModuleController@showjson');
 Route::delete('admin/modules',        'Admin\ModuleController@destroyMany');
 Route::resource('admin/modules',      'Admin\ModuleController');

 Route::get('admin/colparams/json/{table}/{column}',  'Admin\ColParamController@columnjson');
 Route::get('admin/colparams/json/{table}',           'Admin\ColParamController@tablejson');
 Route::get('admin/colparams/json',                   'Admin\ColParamController@indexjson');
 Route::get('admin/colparams/tablelist',              'Admin\ColParamController@tablelist');
 Route::resource('admin/colparams',                   'Admin\ColParamController');


/**
 * Authentication
 */

 // AD LOGIN
 Route::get('/auth/adlogin/{_token}', 'Auth\AuthController@adlogin');

Route::controllers([
  'auth' => 'Auth\AuthController',
  'password' => 'Auth\PasswordController'
  ]);
