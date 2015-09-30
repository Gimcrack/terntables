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
 * Admin Routes
 */

 Route::get('selopts/_{model}_{options}_{labels}', 'PagesController@optionsjson');

 Route::get('admin/users/json',      'Admin\UserController@indexjson');
 Route::get('admin/users/{id}/json', 'Admin\UserController@showjson');
 Route::delete('admin/users',        'Admin\UserController@destroyMany');
 Route::resource('admin/users',      'Admin\UserController');






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
