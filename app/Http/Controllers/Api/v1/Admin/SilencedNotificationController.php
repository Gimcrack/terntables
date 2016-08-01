<?php

namespace App\Http\Controllers\Api\v1\Admin;

use Input;
use App\Server;
use App\ServerAgent;
use App\Http\Requests;
use App\Jobs\UpdateServices;
use Illuminate\Http\Request;
use Illuminate\Foundation\Bus\DispatchesJobs;
use App\Http\Controllers\Api\v1\ApiController;


class SilencedNotificationController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\SilencedNotification';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'SilencedNotification';


  public $limitPerPage = 200;

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'loggable'
  ];

  
}
