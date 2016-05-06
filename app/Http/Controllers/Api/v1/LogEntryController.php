<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use App\LogEntry;
use Input;

class LogEntryController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\LogEntry';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'LogEntry';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'loggable'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth');
    $this->checkAccessMiddleware();
  }

}
