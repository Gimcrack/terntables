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
  public $views = array(
    'index' => 'bi.outages.index'
  );

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\Outage';

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth');
  }
}
