<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Service;
use Input;

class ServiceController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Service';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Service';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'servers',
  ];

  /**
   * Display a listing of the resource in JSON format.
   *
   * @return Response
   */
  public function index()
  {
      $with = Input::get('with',$this->with) ?: [];

      $q = Input::get('q',null);
      $scope = Input::get('scope','all');

      $models = ( !! $q ) ? Service::search( $q )->with($with) : Service::with($with);

      $results = $models
                  ->$scope();

      $results = $results->paginate( $this->limitPerPage, ['id','name'] );

      return response()->json( $results );
  }
}
