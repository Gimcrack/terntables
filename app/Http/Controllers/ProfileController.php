<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use Input;

class ProfileController extends Controller
{

    /**
     * Construct a new PagesController
     * @method __construct
     */
    public function __construct()
    {
      $this->middleware('auth');
    }

    /**
     * Show the user's profile view
     * @method show
     * @return [type] [description]
     */
    public function index()
    {
      return view('pages.profile.index');
    }

    /**
     * Display a listing of the resource in JSON format.
     *
     * @return Response
     */
    public function indexjson()
    {
        $id = \Auth::id();
        return User::with(['groups.modules','person'])->where('id',$id)->get();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request)
    {
      try {
        $input = Input::all();
        $id = \Auth::id();
        $user = User::find($id);
        $user->update($input);
        return $this->operationSuccessful();
      } catch(\Illuminate\Database\QueryException $e) {
        return $this->operationFailed($e);
      }
    }

    /**
     * Reset password of current user
     * @param [type] $id [description]
     */
    public function resetPassword()
    {
      try {
        $input = Input::all();
        $id = \Auth::id();
        $user = User::find($id);
        $user->update(['password' => bcrypt($input['Password1'])]);

        /**
         * To do: notify user of password change.
         */

        return $this->operationSuccessful();

      } catch(\Illuminate\Database\QueryException $e) {
        return $this->operationFailed($e);
      }

    }

    /**
     * The operation was a success
     * @method operationSuccessful
     * @return [type]              [description]
     */
    private function operationSuccessful()
    {
      return [
        "errors" => false,
        "message" => "Operation Completed Successfully"
      ];
    }


    /**
     * The operation failed
     * @method operationFailed
     * @param  [type]          $e [description]
     * @return [type]             [description]
     */
    private function operationFailed($e)
    {
      if ( gettype($e) === 'string' ) {
        return [
          "errors" => true,
          "message" => "There was a problem completing your request: " . $e,
        ];
      } else {
        return [
          "errors" => true,
          "message" => "There was a problem completing your request: " . $e->getMessage(),
        ];
      }
    }
}
