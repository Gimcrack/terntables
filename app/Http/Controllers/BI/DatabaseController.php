<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Database;
use Input;

class DatabaseController extends Controller
{
  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'bi.databases.index'
  );

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\Database';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'applications',
    'servers',
    'people',
    'tags',
    'host'
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
