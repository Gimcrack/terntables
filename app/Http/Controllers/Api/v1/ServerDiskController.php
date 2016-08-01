<?php

namespace App\Http\Controllers\Api\v1;

use Input;
use App\Http\Controllers\Api\v1\ApiController;


class ServerDiskController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\ServerDisk';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'ServerDisk';


  public $limitPerPage = 500;

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server'
  ];

  /**
   * Mark server disks as inactive/not inactive
   * @method markServersDisks
   * @return [type]      [description]
   */
  public function markServerDisks()
  {
    $fillable = ['inactive_flag'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }

}
