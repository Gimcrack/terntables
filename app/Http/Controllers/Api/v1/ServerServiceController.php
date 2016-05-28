<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use App\ServerService;
use Input;

class ServerServiceController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\ServerService';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'ServerService';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server'
  ];


}
