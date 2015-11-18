<?php

namespace App\Http\Controllers\Training;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Requirement;
use App\Tag;
use Input;

class RequirementController extends Controller
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Requirement';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Requirement';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'training.requirements.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'tags',
    'org',
    'collections',
    'jobroles'
    //'parent.parent.parent.parent',
    //'manager.occupant',
    //'occupant'
  ];

  /**
   * Relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'collections',
    'jobroles'
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
