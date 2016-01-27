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
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth');
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

    $user = Auth::user();

    $user->update($input);

    return $this->operationSuccessful();

  }

  /**
   * Reset password of user with id $id
   * @param [type] $id [description]
   */
  public function resetPassword()
  {
    $input = Input::all();
    $user = Auth::user();
    $user->update(['password' => bcrypt($input['Password1'])]);

    /**
     * To do: notify user of password change.
     */

    return $this->operationSuccessful();
  }
}
