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
    'scope_to_outages',
    'assign_to_groups',
    'assign_to_people',
    'scope_to_servers',
    'scope_to_applications',
    'scope_to_groups',
    'scope_to_operating_systems',
    'scope_to_databases',
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'scope_to_outages',
    'assign_to_groups',
    'assign_to_people',
    'scope_to_servers',
    'scope_to_applications',
    'scope_to_groups',
    'scope_to_operating_systems',
    'scope_to_databases'
  ];

}
