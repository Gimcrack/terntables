<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Person;
use App\User;
use Input;

class PersonController extends Controller
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
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.contacts.index');
    }

    /**
     * Display a listing of the resource in JSON format.
     *
     * @return Response
     */
    public function indexjson()
    {
        return Person::with(['users'])->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $input = Input::all();
      $person = Person::create($input);
      if (!empty($input['users'])) {
        User::whereIn('id',$input['users'])->update(['people_id' => $person->id]);
      }
      return $this->operationSuccessful();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
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
        return Person::with(['users'])->findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $contacts)
    {
      try {
        $input = Input::all();
        $person = Person::find($contacts);
        $person->update($input);
        if (!empty($input['users'])) {
          User::where('people_id',$person->id)->whereNotIn('id',$input['users'])->update(['people_id' => null]);

          User::whereIn('id',$input['users'])->update(['people_id' => $person->id]);
        }
        return $this->operationSuccessful();
      } catch(\Illuminate\Database\QueryException $e) {
        return $this->operationFailed($e);
      } catch(\BadMethodCallException $e) {
        return $this->operationFailed($e);
      }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($contacts)
    {
      try {
        Person::find($contacts)->delete();
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
      $input = Input::all();
      Person::whereIn('id',explode(',',$input['ids']) )->delete();
      return $this->operationSuccessful();
    }

}
