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
  public $views = array(
    'index' => 'bi.servers.index'
  );

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
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth', [ 'except' => 'healthServers']);
  }

  /**
   * Server health check view
   * @method healthServers
   * @return [type]        [description]
   */
  public function healthServers()
  {
    return view('bi.servers.health');
  }

}
