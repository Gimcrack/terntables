<?php

namespace App\Http\Controllers\Api\v1\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class NotificationController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Notification';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Notification';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'person',
    'group'
  ];

  /**
   * Mark notifications enabled
   * @method markServers
   * @return [type]      [description]
   */
  public function markNotifications()
  {
    $fillable = ['notifications_enabled'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }
}
