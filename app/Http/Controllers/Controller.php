<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Tag;
use Input;
use Illuminate\Http\Request;
use App\Http\Requests;
use DB;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * The class name of the associated model e.g. App\Tag
     * @var [type]
     */
    public $model_class;

    /**
     * The short name of the associated model e.g. Tag
     * @var [type]
     */
    public $model_short;

    /**
     * The associated views
     * @var [type]
     */
    public $views;

    /**
     * What relationships to grab with the model
     * @var [type]
     */
    public $with;

    /**
     * Many-To-Many Relationships to save
     * @var [type]
     */
    public $relations;

    /**
     * Many-To-One, One-To-One relationships to save
     * @var [type]
     */
    public $belongs;

    /**
     * Default values when creating a new model
     * @var [type]
     */
    public $defaults = [];

    /**
     * Load the checkaccess middleware for the controller
     * @return [type] [description]
     */
    public function checkAccessMiddleware()
    {
      //$this->middleware("checkaccess:{$this->model_short}.read");
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
        $input = Input::all();
        $model_class = $this->model_class;

        $results = ( !empty($input['filter']) ) ?
          $model_class::with($this->with)->whereRaw($input['filter'])->get() :
          $model_class::with($this->with)->get();


        return response()->json( $results  );

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
     * Handle model relations
     * @param  [type] $model [description]
     * @return [type]        [description]
     */
    public function handleRelations($model)
    {
      $input = Input::all();

      foreach($this->relations as $relation) {
        if (!empty($input[$relation]) && method_exists( $model, $relation ) ) {
            $this->handleRelation($model, $relation);
        }
      }
    }

    /**
     * Handle model relation
     * @param  [type] $mode     [description]
     * @param  [type] $relation [description]
     * @return [type]           [description]
     */
    public function handleRelation($model, $relation)
    {
      $input = Input::all();
      $sync = $input[$relation];

      /**
       * Determine if there are extra columns
       * to handle with the relation
       */
      if ( $this->relationHasExtraColumns($input,$relation) ) {
        $cols = $this->getRelationExtraColumns($input,$relation);
        $sync = [];

        /**
         * Iterate through the relation values and attach the
         * related column values
         */
        foreach( $input[$relation] as $key => $value ) {
          $sync[$value] = [];
          foreach( $cols as $col ) {
            if( isset( $input[$col][$key] ) ) {
              $sync[$value][$col] = $input[$col][$key];
            }
          }
        }

      }

      // sync the model with the relation
      return $model->$relation()->sync( $sync );
    }

    /**
     * Get relation extra columns
     * @param  [type] $input    [description]
     * @param  [type] $relation [description]
     * @return [type]           [description]
     */
    public function getRelationExtraColumns($input,$relation)
    {
      $cols = explode(",",$input[ $relation . '_extra_columns' ]);

      unset($cols[ array_search( $relation, $cols ) ]);

      return $cols;
    }

    /**
     * Determine if a relation has extra columns
     * @param  [type] $input    [description]
     * @param  [type] $relation [description]
     * @return [type]           [description]
     */
    public function relationHasExtraColumns($input,$relation)
    {
      return !empty( $input[ $relation . '_extra_columns' ] );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

      $input = array_merge($this->defaults, Input::all() );

      $model_class = $this->model_class;
      $model = $model_class::create($input);

      // process tags
      if (!empty($input['tags'])) {
        Tag::resolveTags( $model, $input['tags'] );
      }

      // process model relations
      if (!empty($this->relations)) {
        $this->handleRelations($model);
      }

      // process m21 relations
      if (!empty($this->belongs)) {
        foreach ($this->belongs as $relation) {
          if ( !empty( $input[ $relation['key'] ] ) ) {
            $tmp_model_class = $relation['model'];
            $ids = $input[ $relation['key'] ];
            $tmp_model_class::whereIn( 'id', $ids )->update([ $relation['foreign_key'] => $model->id ]);
          }
        }
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
        return response()->json($model_class::with($this->with)->findOrFail($id));
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

      // process tags
      if (!empty($input['tags'])) {
        Tag::resolveTags( $model, $input['tags'] );
      }

      // process model relations
      if (!empty($this->relations)) {
        $this->handleRelations($model);
      }

      // process m21 relations
      if (!empty($this->belongs)) {
        foreach ($this->belongs as $relation) {
          if ( !empty( $input[ $relation['key'] ] ) ) {
            $tmp_model_class = $relation['model'];
            $ids = $input[ $relation['key'] ];

            // remove existing attachments that are not in the new list of attachments
            $tmp_model_class::where( $relation['foreign_key'], $model->id )->whereNotIn('id', $ids)->update(  [ $relation['foreign_key'] => null ] );

            $tmp_model_class::whereIn( 'id', $ids )->update([ $relation['foreign_key'] => $model->id ]);
          }
        }
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
      $model_class = $this->model_class;
      $model_class::whereIn('id', $this->getInputIds() )->delete();
      return $this->operationSuccessful();
    }

    /**
     * Get ids from Input
     * @method getInputIds
     * @return [type]      [description]
     */
    public function getInputIds()
    {
      $input = Input::all();
      return $input['ids'];
    }

    /**
     * Mass update the models with selected ids with the changes
     *
     * @param  int  $id
     * @return Response
     */
    public function massUpdate($ids, $changes)
    {
      $table_name = (new $this->model_class)->getTable();
      DB::table($table_name)->whereIn('id',$ids)->update($changes);
      return $this->operationSuccessful();
    }

    /**
     * The operation was a success
     * @method operationSuccessful
     * @return [type]              [description]
     */
    public function operationSuccessful()
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
    public function operationFailed($e)
    {
      if ( gettype($e) === 'string'  ) {
        $message = $e;
      } else {
        $message = "There was a problem completing your request :" . $e->getMessage();
      }
      return [
        "errors" => true,
        "message" => $message,
      ];
    }
}
