<?php

namespace App\Http\Controllers\Admin;

use Input;
use App\ServerAgent;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ServerAgentController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'admin.serverAgents.index'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\ServerAgent';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server'
  ];

  /**
   * Update all the server agents
   * @method updateAllAgents
   *
   * @return   void
   */
  public function updateAll()
  {
      ServerAgent::all()
      ->reject( function( ServerAgent $agent ) {
        return ! $agent->server || $agent->server->inactive_flag;
      })
      ->each( function( ServerAgent $agent ) {
        $agent->server->update(['status' => 'Update Software']);
      });

      return redirect(url( '/admin/serverAgents' ));
  }

}
