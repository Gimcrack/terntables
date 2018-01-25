<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Input;

class OperatingSystemController extends Controller
{
  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'admin.operatingSystems.index'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\OperatingSystem';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'servers'
  ];
}
