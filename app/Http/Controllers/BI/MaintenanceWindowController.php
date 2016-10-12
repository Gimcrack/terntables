<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Input;

class MaintenanceWindowController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'bi.maintenanceWindows.index'
  ];

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'databases',
    'servers',
    'people',
    'tags',
    'owner'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\MaintenanceWindow';

}
