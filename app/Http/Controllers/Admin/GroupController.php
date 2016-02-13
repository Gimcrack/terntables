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
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'admin.groups.index'
  );

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\Group';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'users',
    'roles',
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
