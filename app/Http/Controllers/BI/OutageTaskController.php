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
  public $views = array(
    'index' => 'bi.outages.tasks'
  );

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\OutageTask';

  public $with = [
    'owner',
    'outages',
    'servers',
    'applications',
    'groups',
    'people'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth');
  }
}
