<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class UpdateDetailController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\UpdateDetail';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'UpdateDetail';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    //'header',
    //'server',
  ];

  public $select = [
    'id',
    'title',
    'hostname',
    'owner_name',
  ];

  /**
   * The max rows to grab at one time
   * @var integer
   */
  public $limitPerPage = 500;

  /**
   * Mark servers as prod/not prod/inactive/not inactive
   * @method markServers
   * @return [type]      [description]
   */
  public function markUpdates()
  {
    $fillable = ['approved_flag', 'hidden_flag'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }

}
