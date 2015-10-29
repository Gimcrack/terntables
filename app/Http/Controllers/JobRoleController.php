<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\JobRole as JobRole;
use App\Tag;
use Input;

class JobRoleController extends Controller
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\JobRole';

  public $model_short = 'JobRole';

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'jobroles.index'
  );

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'tags',
    'parent.parent.parent.parent',
    'manager.occupant',
    'occupant'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth');
    $this->middleware("checkaccess:{$this->model_short}.read");
    $this->middleware("checkaccess:{$this->model_short}.create",['only' => ['store'] ]);
    $this->middleware("checkaccess:{$this->model_short}.update",['only' => ['showjson','update'] ]);
    $this->middleware("checkaccess:{$this->model_short}.delete",['only' => ['destroy','destroyMany'] ]);
  }

  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
      return view($this->views->index);
  }

  /**
   * Display a listing of the resource in JSON format.
   *
   * @return Response
   */
  public function indexjson()
  {
      $model_class = $this->model_class;
      return $model_class::with($this->with)->get();
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return Response
   */
  public function show($id)
  {
      $model_class = $this->model_class;
      $model = $model_class::find($id);

      return view('pages.history', compact('model'));
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
    $model_class = $this->model_class;
    $model = $model_class::create($input);
    if (!empty($input['tags'][0])) {
      Tag::resolveTags( $model, explode(',',$input['tags'][0]) );
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
      $model_class = $this->model_class;
      return $model_class::with($this->with)->findOrFail($id);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, $ids)
  {

    $input = Input::all();
    $model_class = $this->model_class;
    $model = $model_class::find($ids);


    $model->update($input);

    if (!empty($input['tags'][0])) {
      Tag::resolveTags( $model, explode(',',$input['tags'][0]) );
    }
    return $this->operationSuccessful();

  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id)
  {
    $model_class = $this->model_class;
    $model_class::find($id)->delete();
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
    $model_class = $this->model_class;
    $model_class::whereIn('id',explode(',',$input['ids']))->delete();
    return $this->operationSuccessful();
  }
}
