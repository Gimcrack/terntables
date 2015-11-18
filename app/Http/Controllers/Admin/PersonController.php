<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Person;
use App\User;
use Input;

class PersonController extends Controller
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Person';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Person';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'admin.contacts.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'users.groups',
    'jobroles'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $belongs = [
    [
      'key' => 'users',
      'model' => 'App\User',
      'foreign_key' => 'people_id'
    ],[
      'key' => 'jobroles',
      'model' => 'App\JobRole',
      'foreign_key' => 'people_id'
    ]
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
