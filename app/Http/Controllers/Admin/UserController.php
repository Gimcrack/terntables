<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use Input;

class UserController extends Controller
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
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'admin.users.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'groups.modules',
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
   * Default values when creating new users
   * @var [type]
   */
  public $defaults = [
    'password' => "$2y$10$2JEOr5ARXCNyVdGBurIZoOxejH9V5JF6oe3pqp8ID0G8daZrHipcq"
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth.admin');
    //$this->checkAccessMiddleware();
  }

  /**
   * Reset password of user with id $id
   * @param [type] $id [description]
   */
  public function resetPassword($id)
  {
    $input = Input::all();
    $user = User::find($id);
    $user->update(['password' => bcrypt($input['Password1'])]);

    /**
     * To do: notify user of password change.
     */

    return $this->operationSuccessful();
  }

}
