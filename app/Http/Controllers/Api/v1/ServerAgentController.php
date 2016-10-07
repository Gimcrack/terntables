<?php

namespace App\Http\Controllers\Api\v1;

use Input;
use App\Server;
use App\ServerAgent;
use App\Http\Requests;
use App\Jobs\UpdateServices;
use Illuminate\Http\Request;
use Illuminate\Foundation\Bus\DispatchesJobs;
use App\Http\Controllers\Api\v1\ApiController;


class ServerAgentController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\ServerAgent';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'ServerAgent';


  public $limitPerPage = 200;

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server'
  ];

  /**
   * Update server statuses
   * @method markServers
   * @return [type]      [description]
   */
  public function markServerAgents()
  {
    $fillable = ['status'];
    return $this->massUpdate( ServerAgent::whereIn('id',$this->getInputIds())->pluck('server_id')->all(), array_intersect_key( Input::all() , array_flip( $fillable ) ), Server::class );
  }

  
}
