<?php

namespace App\Http\Controllers\Api\v1\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;
use Faker\Factory;

class UserController extends ApiController
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
   * Default values when creating new users
   * @var [type]
   */
  public $defaults = [
    'password' => "$2y$10$2JEOr5ARXCNyVdGBurIZoOxejH9V5JF6oe3pqp8ID0G8daZrHipcq",
  ];

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

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $model_class = $this->model_class;
    $faker = Factory::create();
    $input = array_merge($this->defaults, Input::all(), ['api_token' => $faker->unique()->regexify('[A-Za-z0-9]{60}')] );

    \DB::transaction( function() use ($model_class, $input)
    {
      $model = $model_class::create($input)->updateTags();
      $this->handleRelations($model);
    }); // end transaction

    return $this->operationSuccessful(201);
  }
}

