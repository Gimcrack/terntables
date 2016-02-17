<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class OutageTaskController extends ApiController
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\OutageTask';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'OutageTask';


  public $with = [
    'owner',
    'outages',
    'servers',
    'applications',
    'groups',
    'people'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'outages',
    'servers',
    'applications',
    'groups',
    'people'
  ];
  
  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth');
  }
}
