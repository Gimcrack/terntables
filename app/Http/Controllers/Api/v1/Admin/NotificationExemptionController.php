<?php

namespace App\Http\Controllers\Api\v1\Admin;

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

}
