<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use Input;

class UserController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'admin.users.index'
  );

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\User';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'groups.roles',
    'person'
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
