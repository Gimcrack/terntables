<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Module;
use App\RecordLock;
use Input;

class ModuleController extends Controller
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Module';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Module';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'admin.modules.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'groups.users'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'groups'
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
