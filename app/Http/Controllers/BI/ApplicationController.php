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
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Application';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Application';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'bi.applications.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'databases',
    'servers',
    'people',
    'tags'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'people',
    'servers',
    'databases'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth');
    $this->checkAccessMiddleware();
  }

  /**
   * Mark applications as inactive/not inactive
   * @method markApplications
   * @return [type]      [description]
   */
  public function markApplications()
  {
    $fillable = ['inactive_flag'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }

}
