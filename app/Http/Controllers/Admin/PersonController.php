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
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'admin.contacts.index'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\Person';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'users.groups',
    'servers',
  ];

}
