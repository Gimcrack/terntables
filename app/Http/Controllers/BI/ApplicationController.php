<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Application;
use Input;

class ApplicationController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'bi.applications.index'
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
  public $model_class = 'App\Application';

}
