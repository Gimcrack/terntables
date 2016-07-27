<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Input;

class ServerAgentController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'admin.serverAgents.index'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\ServerAgent';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server'
  ];

}
