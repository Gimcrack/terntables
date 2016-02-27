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
    $this->middleware('auth');
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

  public function windowsUpdateServerIndex()
  {
    $input = Input::all();
    $model_class = $this->model_class;

    $input['filter'] = $this->parseSearchFilter();

    $results = ( !empty($input['filter']) ) ?
      $model_class::with(['owner','operating_system','updates' => function($q) {
        $q->where('installed_flag',0)->where('approved_flag',1);
      }])
        ->windows()->whereRaw($input['filter'])->paginate( $this->limitPerPage ) :
      $model_class::with(['owner','operating_system','updates' => function($q) {
        $q->where('installed_flag',0)->where('approved_flag',1);
      }])
        ->windows()->paginate( $this->limitPerPage );

    return response()->json( $results );
  }
}
