<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Widget;
use App\Tag;
use Input;

class WidgetController extends Controller
{
  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth');
    $this->middleware('checkaccess:Widget.read');
    $this->middleware('checkaccess:Widget.create',['only' => ['store'] ]);
    $this->middleware('checkaccess:Widget.update',['only' => ['showjson','update'] ]);
    $this->middleware('checkaccess:Widget.delete',['only' => ['destroy','destroyMany'] ]);

  }

  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
      return view('widgets.index');
  }

  /**
   * Display a listing of the resource in JSON format.
   *
   * @return Response
   */
  public function indexjson()
  {
      return Widget::with(['tags'])->get();
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
    $widget = Widget::create($input);
    if (!empty($input['tags'][0])) {
      Tag::resolveTags( $widget, explode(',',$input['tags'][0]) );
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
      return Widget::with(['tags'])->findOrFail($id);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $widgets)
  {

    $input = Input::all();
    $widget = Widget::find($widgets);
    $widget->update($input);

    if (!empty($input['tags'][0])) {
      Tag::resolveTags( $widget, explode(',',$input['tags'][0]) );
    }
    return $this->operationSuccessful();

  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($widgets)
  {
    Widget::find($widgets)->delete();
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
    Widget::whereIn('id',explode(',',$input['ids']))->delete();
    return $this->operationSuccessful();
  }
}
