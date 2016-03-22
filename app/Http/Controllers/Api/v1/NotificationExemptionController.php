<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class NotificationExemptionController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\NotificationExemption';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'NotificationExemption';

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth.admin');
    $this->checkAccessMiddleware();
  }
}
