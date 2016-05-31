<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use App\ServerService;
use DB;

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

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server'
  ];

  /**
   * Update all the services for a specified server
   *
   * @param      <type>  $id     The identifier
   */
  public function updateAll($id, Request $request)
  {
    DB::transaction( function() use ($request, $id)  {
      $services = $request->all();
      
      foreach( $services as $service )
      {        
        if ( ! isset($service['name']) ) continue;

        if ( !! $svc = ServerService::where('server_id',$id)
          ->where('name',$service['name'])->first() )
        {
          $svc->update($service);
        }
        else
        {
          $service['server_id'] = $id;
          ServerService::create($service);
        }

      }

    });
    
    return $this->operationSuccessful();
    
  }


}
