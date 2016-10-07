<?php

namespace App\Http\Controllers\Api\v1;

use Input;
use App\Http\Controllers\Api\v1\ApiController;


class ServerServiceController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\ServerService';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'ServerService';


  public $limitPerPage = 500;

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server',
    'service'
  ];

  /**
   * Mark server services
   * @method markServersDisks
   * @return [type]      [description]
   */
  public function markServerServices()
  {
    $fillable = ['command', 'ignored_flag'];
    return $this->massUpdate( 
      $this->getInputIds(),
      array_intersect_key( Input::all() , array_flip( $fillable ) )
    );
  }

}
