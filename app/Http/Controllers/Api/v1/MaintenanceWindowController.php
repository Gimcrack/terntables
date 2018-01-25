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


class MaintenanceWindowController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\MaintenanceWindow';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'MaintenanceWindow';


  public $limitPerPage = 100;

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'group'
  ];

  /**
   * Update Maintenance Windows
   * @method markMaintenanceWindows
   * @return [type]      [description]
   */
  public function markMaintenanceWindows()
  {
    $fillable = ['inactive_flag'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }

  
}
