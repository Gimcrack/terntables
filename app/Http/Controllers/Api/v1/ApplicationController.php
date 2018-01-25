<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class ApplicationController extends ApiController
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Application';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Application';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'databases',
    'servers',
    'people',
    'tags',
    'owner'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'people',
    'servers',
    'databases'
  ];

  /**
   * Mark applications as inactive/not inactive
   * @method markApplications
   * @return [type]      [description]
   */
  public function markApplications()
  {
    $fillable = ['inactive_flag'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }
}
