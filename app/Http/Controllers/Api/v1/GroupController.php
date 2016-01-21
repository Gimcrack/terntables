<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class GroupController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Group';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Group';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'users',
    'roles',
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'users',
    'roles'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth.admin');
    $this->checkAccessMiddleware();
  }

}
