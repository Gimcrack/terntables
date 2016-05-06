<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use App\Alert;
use Input;

class AlertController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Alert';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Alert';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'alertable'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth');
    $this->checkAccessMiddleware();
  }

  /**
   * [acknowledge description]
   * @method acknowledge
   * @param  string      $id [description]
   * @return [type]          [description]
   */
  public function acknowledge( $id )
  {
    Alert::find($id)->update(['acknowledged_flag' => 1]);
    return $this->operationSuccessful();
  }


  public function acknowledge_all()
  {
    Alert::unacknowledged()->update(['acknowledged_flag' => 1]);
    return $this->operationSuccessful();
  }

  /**
   * Get servers with active alerts
   * @method alertServers
   * @return [type]       [description]
   */
  public function serverAlerts()
  {
    $my_groups = \Auth::user()->groups()->lists('id');
    $my_servers = \App\Server::whereIn('group_id', $my_groups)->lists('id');

    $alerts = Alert::with('alertable')
      ->serverAlerts()
      ->unacknowledged()
      ->orderBy('created_at','desc')
      ->whereIn('alertable_id', $my_servers)
      ->get();

    return response()->json($alerts);
  }
}
