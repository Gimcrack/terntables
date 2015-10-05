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
     * Spawn a new instance of the controller
     */
    public function __construct()
    {
      $this->middleware('auth.admin');
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return view('admin.users.index');
    }

    /**
     * Display a listing of the resource in JSON format.
     *
     * @return Response
     */
    public function indexjson()
    {
        return User::with(['groups.modules','person'])->get();
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        try {
          $input = Input::all();
          $input['password'] = bcrypt('P@ssw0rd');
          $user = User::create($input);
          if (!empty($input['groups'])) {
            $user->groups()->attach($input['groups']);
          }
          return $this->operationSuccessful();
        } catch(\Illuminate\Database\QueryException $e) {
          return $this->operationFailed($e);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Display the specified resource in JSON format.
     *
     * @param  int  $id
     * @return Response
     */
    public function showjson($id)
    {
        return User::with(['groups.modules'])->findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $users)
    {
      try {
        $input = Input::all();
        $user = User::find($users);
        $user->update($input);
        if (!empty($input['groups'])) {
          $user->groups()->sync($input['groups']);
        }
        return $this->operationSuccessful();
      } catch(\Illuminate\Database\QueryException $e) {
        return $this->operationFailed($e);
      }
    }

    /**
     * Reset password of user with id $id
     * @param [type] $id [description]
     */
    public function resetPassword($id)
    {
      try {
        $input = Input::all();
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($users)
    {
      try {
        User::find($users)->delete();
        return $this->operationSuccessful();
      } catch(\Illuminate\Database\QueryException $e) {
        return $this->operationFailed($e);
      }
    }

    /**
     * Remove the specified resources from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroyMany()
    {
      try {
        $input = Input::all();
        User::whereIn('id',$input['ids'])->delete();
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
      return [
        "errors" => true,
        "message" => "There was a problem completing your request :" . $e->getMessage(),
      ];
    }
}
