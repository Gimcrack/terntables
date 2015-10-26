<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Org;
use App\Tag;
use Input;


class OrgController extends Controller
{
  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth');
    $this->middleware('checkaccess:Org.read');
    $this->middleware('checkaccess:Org.create',['only' => ['store'] ]);
    $this->middleware('checkaccess:Org.update',['only' => ['showjson','update'] ]);
    $this->middleware('checkaccess:Org.delete',['only' => ['destroy','destroyMany'] ]);
  }

  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
      return view('orgs.index');
  }

  /**
   * Display a listing of the resource in JSON format.
   *
   * @return Response
   */
  public function indexjson()
  {
      return Org::with(['tags','parent.parent.parent.parent'])->get();
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
    $org = Org::create($input);
    if (!empty($input['tags'][0])) {
      Tag::resolveTags( $org, explode(',',$input['tags'][0]) );
    }
    return $this->operationSuccessful();

  }

  /**
   * Display the specified resource in JSON format.
   *
   * @param  int  $id
   * @return Response
   */
  public function showjson($id)
  {
      return Org::with(['tags'])->findOrFail($id);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $orgs)
  {

    $input = Input::all();
    $org = Org::find($orgs);
    $org->update($input);

    if (!empty($input['tags'][0])) {
      Tag::resolveTags( $org, explode(',',$input['tags'][0]) );
    }
    return $this->operationSuccessful();

  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($orgs)
  {
    Org::find($orgs)->delete();
    return $this->operationSuccessful();
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
    Org::whereIn('id',explode(',',$input['ids']))->delete();
    return $this->operationSuccessful();
  }
}
