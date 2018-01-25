<?php

namespace App\Http\Controllers\Api\v1\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class OperatingSystemController extends ApiController
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\OperatingSystem';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'OperatingSystem';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'servers'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $belongs = [
    [
      'key' => 'servers',
      'model' => 'App\Server',
      'foreign_key' => 'operating_system_id',
      'reset' => [ 'operating_system_id' => null ]
    ]
  ];

}
