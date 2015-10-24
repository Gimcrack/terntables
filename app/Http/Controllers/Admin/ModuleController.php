<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Module;
use App\RecordLock;
use Input;

class ModuleController extends Controller
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
        return view('admin.modules.index');
    }

    /**
     * Display a listing of the resource in JSON format.
     *
     * @return Response
     */
    public function indexjson()
    {
        return Module::with(['groups.users'])->get();
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
      try {
        $input = Input::all();
        $module = Module::create($input);
        if (!empty($input['groups'])) {
          $module->groups()->attach($input['groups']);
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
        return $module = Module::with(['groups.users'])->findOrFail($id);
    }

    /**
     * Checkout the module
     * @method checkout
     * @param  [type]   $module [description]
     * @return [type]           [description]
     */
    private function checkout($module)
    {
      RecordLock::checkout($module);
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
    public function update(Request $request, $modules)
    {
      try {
        $input = Input::all();
        $module = Module::find($modules);
        $module->update($input);
        if (!empty($input['groups'])) {
          $module->groups()->sync($input['groups']);
        }
        return $this->operationSuccessful();
      } catch(\Illuminate\Database\QueryException $e) {
        return $this->operationFailed($e);
      }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($modules)
    {
      try {
        Module::find($modules)->delete();
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
      Module::whereIn('id',explode(',',$input['ids']))->delete();
      return $this->operationSuccessful();
    }

}
