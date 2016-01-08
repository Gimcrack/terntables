<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class ModuleController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Module';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Module';

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

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth.admin');
    $this->checkAccessMiddleware();
  }
}
