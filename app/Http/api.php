<?php

/**
 * API Routes
 * 
 * namespace App\Http\Controller\Api\v1
 */
Route::group(['prefix' => 'api/v1', 'middleware' => 'api' ], function() {
  //helper routes
  Route::get('{model}/_selectOptions/{options}_{labels}_{filter}', 'ApiController@getSelectOptions');
  Route::get('{model}/_selectOptions/{options}_{labels}', 'ApiController@getSelectOptions');
  
  Route::get('{model}/_tokenOptions/{options}_{labels}',  'ApiController@getTokensOptions');
  Route::get('{model}/_getPermissions', 'ApiController@getPermissions');
  Route::get('{model}/_checkedOut',     'ApiController@getCheckedOutRecords');
  Route::get('{model}/_checkinAll',     'ApiController@checkinAll');
  Route::get('{model}/{id}/_checkout',  'ApiController@checkout');
  Route::get('{model}/{id}/_checkin',   'ApiController@checkin');
  Route::get('{model}/{id}/_inspect',   'ApiController@inspect');

  Route::get('_checkinAll',             'ApiController@checkinAll');
  Route::get('_checkAccess/{role}',     'ApiController@checkAccess');
});

// admin routes
Route::group( [ 'prefix' => 'api/v1', 'middleware' => 'api.admin' ], function() {
  
  Route::patch('User/{id}/resetPassword/', 'Admin\UserController@resetPassword');
  Route::delete('User',                    'Admin\UserController@destroy');
  Route::resource('User',                  'Admin\UserController');

  Route::delete('Group',                   'Admin\GroupController@destroy');
  Route::resource('Group',                 'Admin\GroupController');

  Route::delete('Notification',            'Admin\NotificationController@destroy');
  Route::patch('Notification/_massUpdate', 'Admin\NotificationController@markNotifications');
  Route::resource('Notification',          'Admin\NotificationController');

  Route::delete('NotificationExemption',   'Admin\NotificationExemptionController@destroy');
  Route::resource('NotificationExemption', 'Admin\NotificationExemptionController');

  Route::patch('Person/_massUpdate',       'Admin\PersonController@massUpdate');
  Route::delete('Person',                  'Admin\PersonController@destroy');
  Route::resource('Person',                'Admin\PersonController');

  Route::delete('Role',                    'Admin\RoleController@destroy');
  Route::resource('Role',                  'Admin\RoleController');

  Route::delete('OperatingSystem',         'Admin\OperatingSystemController@destroy');
  Route::resource('OperatingSystem',       'Admin\OperatingSystemController');
});


// user routes
Route::group(['prefix' => 'api/v1', 'middleware' => 'api' ], function() {

  Route::get('AD/User', 'ActiveDirectoryController@index');
  Route::get('AD/User/{id}', 'ActiveDirectoryController@show');

  //user routes
  Route::get('Profile',                 'ProfileController@index');
  Route::get('Profile/{id}',            'ProfileController@show');
  Route::patch('Profile/resetPassword', 'ProfileController@resetPassword');
  Route::patch('Profile/{id}',          'ProfileController@update');

  // oit routes
  Route::delete('Server',             'ServerController@destroy');
  Route::patch('Server/_massUpdate/_addTag',        'ServerController@addTag');
  Route::patch('Server/_massUpdate/_removeTag',      'ServerController@removeTag');
  Route::patch('Server/_massUpdate',  'ServerController@markServers');
  Route::get('Server/_health',        'ServerController@healthServers');
  Route::any('Server/{id}/Services',  'ServerController@updateServices');
  Route::any('Server/{id}/Agent',     'ServerController@updateAgentStatus');
  Route::any('Server/UpdateAgents',   'ServerController@updateAllAgents');
  Route::resource('Server',           'ServerController');

  Route::patch('ServerAgent/_massUpdate',  'ServerAgentController@markServerAgents');
  Route::resource('ServerAgent',           'ServerAgentController');

  Route::patch('ServerDisk/_massUpdate',  'ServerDiskController@markServerDisks');
  Route::resource('ServerDisk',           'ServerDiskController');

  Route::any('DatabaseInstance/Server/{id}', 'DatabaseInstanceController@updateFromAgent');
  Route::resource('DatabaseInstance', 'DatabaseInstanceController', ['except' => 'delete'] );

  Route::get('Alert/_acknowledge',      'AlertController@acknowledge_all');
  Route::get('Alert/{id}/_acknowledge', 'AlertController@acknowledge');
  Route::get('Alert/_server',          'AlertController@serverAlerts');
  Route::resource('Alert',              'AlertController', [ 'except' => 'delete']);

  Route::resource('LogEntry', 'LogEntryController');
  
  Route::resource('Service', 'ServiceController');

  Route::patch('WindowsUpdateServer/_massUpdate', 'ServerController@markServers');
  Route::get('WindowsUpdateServer',               'ServerController@windowsUpdateServerIndex');

  Route::patch('UpdateDetail/_massUpdate',  'UpdateDetailController@markUpdates');
  Route::get('UpdateDetail',                'UpdateDetailController@index');


  Route::delete('Database',           'DatabaseController@destroy');
  Route::patch('Database/_massUpdate', 'DatabaseController@markDatabases');
  Route::resource('Database',         'DatabaseController');

  Route::delete('Application',           'ApplicationController@destroy');
  Route::patch('Application/_massUpdate', 'ApplicationController@markApplications');
  Route::resource('Application',          'ApplicationController');

  Route::delete('Outage',           'OutageController@destroy');
  Route::patch('Outage/_massUpdate', 'OutageController@markOutages');
  Route::resource('Outage',          'OutageController');

  Route::delete('OutageTask',             'OutageTaskController@destroy');
  Route::patch('OutageTask/_massUpdate',  'OutageTaskController@markOutageTasks');
  Route::resource('OutageTask',           'OutageTaskController');

  Route::delete('OutageTaskDetail',             'OutageTaskDetailController@destroy');
  Route::patch('OutageTaskDetail/_massUpdate',  'OutageTaskDetailController@markOutageTasks');
  Route::patch('OutageTaskDetail/_massUpdateServers',  'OutageTaskDetailController@markServers');
  Route::resource('OutageTaskDetail',           'OutageTaskDetailController');

  // gis routes
  Route::delete('Document',                 'DocumentController@destroy');
  Route::resource('Document',               'DocumentController');
});
