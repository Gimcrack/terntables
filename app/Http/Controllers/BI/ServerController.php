<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Server;
use Input;

class ServerController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'bi.servers.index'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\Server';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'applications',
    'databases',
    'people',
    'tags',
    'owner',
    'operating_system',
    'update_batches'
  ];

  /**
   * Server health check view
   * @method healthServers
   * @return [type]        [description]
   */
  public function healthServers()
  {
    return view('bi.servers.health');
  }

  /**
   * Update all the server agents
   * @method updateAllAgents
   *
   * @return   void
   */
  public function updateAllAgents()
  {
      $this->middleware('admin');

      $max_version = Server::active()->lists('software_version')->max();

      Server::whereNotNull('software_version')
          ->where('software_version','<',$max_version)
          ->where('status','Idle')
          ->update(['status' => 'Update Software']);

      return view('bi.updates.index');
  }

}
