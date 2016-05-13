<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class OutageTaskController extends Controller
{
  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'bi.outages.tasks'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\OutageTask';

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
}
