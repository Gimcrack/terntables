<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Application;
use Input;

class LogEntryController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'bi.logs.index'
  ];

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'loggable'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\LogEntry';
}
