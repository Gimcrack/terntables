<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Group;
use Input;

class GroupController extends Controller
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Group';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Group';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'admin.groups.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'users',
    'modules',
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'users',
    'modules'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth.admin');
    //$this->checkAccessMiddleware();
  }

}
