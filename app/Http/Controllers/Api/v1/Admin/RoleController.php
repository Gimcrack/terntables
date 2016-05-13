<?php

namespace App\Http\Controllers\Api\v1\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class RoleController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Role';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Role';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'groups.users'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'groups'
  ];

}
