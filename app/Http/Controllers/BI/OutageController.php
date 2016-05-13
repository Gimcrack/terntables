<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class OutageController extends Controller
{
  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'bi.outages.index'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\Outage';

  public $with = [
    'tasks'
  ];
}
