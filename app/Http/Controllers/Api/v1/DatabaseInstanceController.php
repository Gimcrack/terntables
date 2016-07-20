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
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'people',
    'applications',
    'databases'
  ];

  // /**
  //  * Parse the search filter
  //  * @method parseSearchFilter
  //  * @return [type]            [description]
  //  */
  // public function parseSearchFilter()
  // {
  //   $filter = Input::get('filter',null);

  //   if (empty($filter))
  //   {
  //     return '1=1';
  //   }

  //   $search = [':show__only__my__groups:'];
  //   $replace = [$this->showOnlyMyGroupsCriteria()];

  //   $filter = str_replace($search,$replace,$filter);

  //   return $filter;
  // }

  // /**
  //  * Get the criteria for my groups tasks
  //  * @method showOnlyAvailableCriteria
  //  * @return [type]                    [description]
  //  */
  // private function showOnlyMyGroupsCriteria()
  // {
  //   $my_groups = implode(",",$this->user->groups()->lists('id')->toArray() );
  //   return "group_id in ({$my_groups})";
  // }

  // /**
  //  * Mark servers as prod/not prod/inactive/not inactive
  //  * @method markServers
  //  * @return [type]      [description]
  //  */
  // public function markServers()
  // {
  //   $fillable = ['production_flag', 'inactive_flag', 'status'];
  //   return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  // }

  // /**
  //  * Get all the servers for a health check
  //  * @method healthServers
  //  * @return [type]        [description]
  //  */
  // public function healthServers()
  // {
  //   $data = Server::with(['alerts' => function($query) {
  //     $query->unacknowledged();
  //   }])
  //     ->active()
  //     ->windows()
  //     ->get();
  //   return response()->json($data);
  // }

  // public function windowsUpdateServerIndex(Request $request)
  // {

  //   $input = $request->all();
  //   $model_class = $this->model_class;

  //   $filter = $this->parseSearchFilter();

  //   $with = ['owner','operating_system'];

  //   $q = $request->input('q',null);
  //   $scope = $request->input('scope','all');

  //   if ( !! $q ) {
  //     $results = $model_class::search( $q )
  //                 ->with($with)
  //                 ->windows()
  //                 ->updatable( )
  //                 ->hasUpdates( $request->input('showUnupdatable',false) )
  //                 ->$scope()
  //                 ->whereRaw($filter)
  //                 ->paginate( $this->limitPerPage );
  //   } else {
  //     $results = $model_class::with($with)
  //                 ->windows()
  //                 ->updatable()
  //                 ->hasUpdates( $request->input('showUnupdatable',false) )
  //                 ->$scope()
  //                 ->whereRaw($filter)
  //                 ->paginate( $this->limitPerPage );
  //   }

  //   return response()->json( $results );
  // }

  // /**
  //  * Update the services for the selected server
  //  */
  // public function updateServices($server_id, Request $request)
  // {
  //   $this->dispatch( new UpdateServices( $server_id, $request ) );
      
  //   return $this->operationSuccessful();
  // }

  /**
   * Update the DatabaseInstance for the selected server
   * @method updateFromAgent
   *
   * @return   void
   */
  public function updateFromAgent($server_id, Request $request)
  {
      $data = $request->get("0");

      $atts = [
        'server_id' => $server_id,
        'group_id' => \App\Group::where('name','BIT')->first()->id,
        'name' => $data['Instance'],
        'sql_product' => $data['Product'],
        'sql_edition' => $data['ProductEdition'],
        'sql_version' => $data['Version'],
        'min_memory' => $data['MinMemoryMB'],
        'max_memory' => $data['MaxMemoryMB'],
        'total_memory' => $data['ServerMemoryMB'],
        'processors' => $data['CPUs'],
        'collation' => $data['Collation'],
        'compress_backups_flag' => $data['BackupCompression'],
        'max_degree_of_parallelism' => $data['MaxDegreeOfParallelism'],
        'cost_threshold_of_parallelism' => $data['CostThresholdOfParalleism'],
      ];

      if ( !! $dbi = DatabaseInstance::where('server_id',$server_id)->first() ) {
          $dbi->update( $atts );
      } else {
        $dbi = DatabaseInstance::create($atts);
      }

      return $dbi;
  }
  
}
