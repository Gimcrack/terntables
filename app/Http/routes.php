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

Route::get('/', 'PagesController@home');
Route::get('/home', 'PagesController@home');

/**
 * User Routes
 */

Route::get('profile', 'ProfileController@index');
Route::get('users/json', 'ProfileController@indexjson');
Route::patch('users/{id}', 'ProfileController@update');
Route::patch('resetPassword/{id}', 'ProfileController@resetPassword');

/**
 * Admin Routes
 */

 Route::get('selopts/_{model}_{options}_{labels}', 'PagesController@optionsjson');
 Route::get('checkout/_{model}_{id}', 'PagesController@checkout');
 Route::get('checkedout/_{model}', 'PagesController@getCheckedOutRecords');
 Route::get('checkin/_{model}_{id}', 'PagesController@checkin');
 Route::get('checkin/all', 'PagesController@checkinAll');

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

 //Route::resource('admin/groups',     'Admin\GroupController');



/**
 * Authentication
 */

 // AD LOGIN
 Route::get('/auth/adlogin/{_token}', 'Auth\AuthController@adlogin');

Route::controllers([
  'auth' => 'Auth\AuthController',
  'password' => 'Auth\PasswordController'
  ]);
