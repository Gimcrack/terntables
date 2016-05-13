<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;

class ProfileController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\User';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'User';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'groups.roles',
    'person'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'groups',
  ];


  /**
   * Display a listing of the resource in JSON format.
   *
   * @return Response
   */
  public function index()
  {
    $input = Input::all();
    $model_class = $this->model_class;

    $results = $model_class::with($this->with)->whereHas('person', function($query) {
      $query->where('id', $this->user->person->id );
    })->paginate( $this->limitPerPage );

    return response()->json( $results );
  }


  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $ids = null)
  {
    $input = Input::all();
    $model_class = $this->model_class;

    $model = $model_class::with($this->with)->whereHas('person', function($query) {
      $query->where('id', $this->user->person->id );
    })->where('id', $ids)->first();

    if ( ! $model->count() ) {
      throw new ModelNotFoundException();
    }

    $model->update($input);

    return $this->operationSuccessful();

  }

  /**
   * Reset password of user with id $id
   * @param [type] $id [description]
   */
  public function resetPassword()
  {
    $input = Input::all();
    $user = $this->user;
    $user->update(['password' => bcrypt($input['Password1'])]);

    /**
     * To do: notify user of password change.
     */

    return $this->operationSuccessful();
  }
}
