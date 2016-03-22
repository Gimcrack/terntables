<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class ServerController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Server';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Server';


  public $limitPerPage = 200;

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
    'operating_system'
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

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth', [ 'except' => 'healthServers']);
    $this->checkAccessMiddleware();
  }

  /**
   * Mark servers as prod/not prod/inactive/not inactive
   * @method markServers
   * @return [type]      [description]
   */
  public function markServers()
  {
    $fillable = ['production_flag', 'inactive_flag', 'status'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }

  /**
   * Get servers with active alerts
   * @method alertServers
   * @return [type]       [description]
   */
  public function alertServers()
  {
    return response()->json(\App\Server::active()->whereNotNull('alert')->where('alert','!=','')->get());
  }

  /**
   * Get all the servers for a health check
   * @method healthServers
   * @return [type]        [description]
   */
  public function healthServers()
  {
    return response()->json(\App\Server::active()->windows()->orderBy('alert','desc')->get());
  }

  public function windowsUpdateServerIndex()
  {

    $input = Input::all();
    $model_class = $this->model_class;

    $filter = $this->parseSearchFilter();

    $with = ['owner','operating_system','updates' => function($q) {
      $q->where('installed_flag',0)->where('approved_flag',1);
    }];

    $q = Input::get('q',null);
    $scope = Input::get('scope','all');

    if ( !! $q ) {
      $results = $model_class::search( $q )
                  ->with($with)
                  ->windows()
                  ->updatable()
                  ->$scope()
                  ->whereRaw($filter)
                  ->paginate( $this->limitPerPage );
    } else {
      $results = $model_class::with($with)
                  ->windows()
                  ->updatable()
                  ->$scope()
                  ->whereRaw($filter)
                  ->paginate( $this->limitPerPage );
    }

    return response()->json( $results );
  }
}
