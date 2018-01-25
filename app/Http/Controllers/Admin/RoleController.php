<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Role;
use App\RecordLock;
use Input;

class RoleController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'admin.roles.index'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\Role';
}
