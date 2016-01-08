<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class DatabaseController extends ApiController
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Database';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Database';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'applications',
    'servers',
    'people',
    'tags',
    'host'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'people',
    'applications',
    'servers'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth');
  }

  /**
   * Mark databases as prod/not prod/inactive/not inactive
   * @method markServers
   * @return [type]      [description]
   */
  public function markDatabases()
  {
    $fillable = ['production_flag', 'inactive_flag', 'ignore_flag'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }
}
