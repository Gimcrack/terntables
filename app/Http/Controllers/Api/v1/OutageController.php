<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Input;

class OutageController extends ApiController
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Outage';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Outage';

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth');
  }

  /**
   * Update the selected outages
   * @method updateOutages
   * @return [type]        [description]
   */
  public function markOutages()
  {
    $fillable = ['complete_flag'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }
}
