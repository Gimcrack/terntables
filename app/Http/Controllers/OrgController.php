<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Org;
use App\Tag;
use Input;


class OrgController extends Controller
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Org';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Org';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'orgs.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'tags',
    'parent.parent.parent.parent',
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
