<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;
use Illuminate\Foundation\Bus\DispatchesJobs;

use App\Jobs\UpdateServices;
use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use App\Server;
use App\DatabaseInstance;

use Input;

class DatabaseInstanceController extends ApiController
{
  use DispatchesJobs;

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\DatabaseInstance';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'DatabaseInstance';


  public $limitPerPage = 200;

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'owner',
    'server'
  ];

  /**
   * Update the DatabaseInstance for the selected server
   * @method updateFromAgent
   *
   * @return   void
   */
  public function updateFromAgent($server_id, Request $request)
  {
      $data = $request->get("0");

      if ( ! isset($data['Instance']) )
      {
        return $this->operationFailed("Oops, looks like you forgot to include the data.",406);
      }

      $atts = [
        'server_id' => $server_id,
        'group_id' => \App\Server::find($server_id)->owner->id,
        'name' => $data['Instance'],
        'sql_product' => $data['Product'],
        'sql_edition' => $data['ProductEdition'],
        'sql_version' => $data['Version'],
        'min_memory' => $data['MinMemoryMB'],
        'max_memory' => $data['MaxMemoryMB'],
        'total_memory' => $data['ServerMemoryMB'],
        'processors' => $data['CPUs'],
        'collation' => $data['Collation'],
        'compress_backups_flag' => $data['BackupCompression'] ?: 0,
        'max_degree_of_parallelism' => $data['MaxDegreeOfParallelism'],
        'cost_threshold_of_parallelism' => $data['CostThresholdOfParalleism'],
      ];

      if ( !! $dbi = DatabaseInstance::where('server_id',$server_id)->first() ) {
          $dbi->update( $atts );
      } else {
        $dbi = DatabaseInstance::create($atts);
      }

      $dbi->touch();

      return $dbi;
  }
  
}
