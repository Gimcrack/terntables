<?php

namespace App\Http\Controllers\Api\v1\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class PersonController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Person';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Person';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'users.groups',
    'servers',
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'servers',
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $belongs = [
    [
      'key' => 'users',
      'model' => 'App\User',
      'foreign_key' => 'people_id',
      'reset' => [ 'people_id' => null, 'comment' => null , 'primary_flag' => 0]
    ]
  ];

}
