<?php

namespace App\Http\Controllers\Training;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Collection;
use App\Tag;
use Input;

class CollectionController extends Controller
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Collection';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Collection';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'training.collections.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'tags',
    'resources',
    'requirements',
    'org.parent.parent.parent'
    //'parent.parent.parent.parent',
    //'manager.occupant',
    //'occupant'
  ];

  /**
   * M2M relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'resources',
    'requirements'
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
