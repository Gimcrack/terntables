<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\JobRole;
use App\Tag;
use Input;

class JobRoleController extends Controller
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\JobRole';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'JobRole';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'jobroles.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'tags',
    'parent.parent.parent.parent',
    'manager.occupant',
    'occupant'
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



}
