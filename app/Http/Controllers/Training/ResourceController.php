<?php

namespace App\Http\Controllers\Training;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Resource;
use App\Tag;
use Input;

class ResourceController extends Controller
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Resource';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Resource';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'training.resources.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'tags',
    'org.parent.parent.parent',
    'collections',
    'attachments'
    //'parent.parent.parent.parent',
    //'manager.occupant',
    //'occupant'
  ];

  /**
   * M2M relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'collections'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $belongs = [
    [
      'key' => 'attachments',
      'model' => 'App\Attachment',
      'foreign_key' => 'resource_id'
    ]
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
