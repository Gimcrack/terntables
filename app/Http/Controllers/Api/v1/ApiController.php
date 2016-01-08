<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RecordLock;
use Input;
use Auth;
use DB;

class ApiController extends Controller
{
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
   * The max rows to grab at one time
   * @var integer
   */
  public $limitPerPage = 100;

  /**
   * Load the checkaccess middleware for the controller
   * @return [type] [description]
   */
  public function checkAccessMiddleware()
  {
    //$this->middleware("checkaccess:{$this->model_short}.read");
    $this->middleware("checkaccess:{$this->model_short}.create",['only' => ['store'] ]);
    $this->middleware("checkaccess:{$this->model_short}.update",['only' => ['show','update'] ]);
    $this->middleware("checkaccess:{$this->model_short}.delete",['only' => ['destroy','destroyMany'] ]);
  }

  /**
   * Display a listing of the resource in JSON format.
   *
   * @return Response
   */
  public function index()
  {
      $input = Input::all();
      $model_class = $this->model_class;

      $results = ( !empty($input['filter']) ) ?
        $model_class::with($this->with)->whereRaw($input['filter'])->paginate( $this->limitPerPage ) :
        $model_class::with($this->with)->paginate( $this->limitPerPage );

      return response()->json( $results );
  }

  /**
   * Display the specified resource in JSON format.
   *
   * @param  int  $id
   * @return Response
   */
  public function show($id)
  {
      $model_class = $this->model_class;

      $data = $model_class::with($this->with)->findOrFail($id);

      return response()->json( $data );
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
   * Get select options for a model
   * @param  [type] $model   [description]
   * @param  [type] $options [description]
   * @param  [type] $labels  [description]
   * @return [type]          [description]
   */
  public function getSelectOptions($model,$options,$labels = [])
  {
    $class = "\\App\\{$model}";
    if (empty($labels)) { $labels = $options; }

    return response()->json( $class::select("{$options} as option", DB::raw("{$labels} as label"))->orderBy("label","ASC")->get() );
  }

  /**
   * Get token options for a model
   * @param  [type] $model   [description]
   * @param  [type] $options [description]
   * @param  [type] $labels  [description]
   * @return [type]          [description]
   */
  public function getTokensOptions($model,$options,$labels = [])
  {
    $class = "\\App\\{$model}";
    if (empty($labels)) { $labels = $options; }
    $q = \Input::get('q') ?: '';

    return response()->json( $class::select("{$options} as id", DB::raw("{$labels} as name"))->where( $labels,'like', "%{$q}%" )->orderBy("name","ASC")->get() );
  }

  /**
   * Get all user permissions on the specified model
   * @method getPermissions
   * @param  [type]         $model [description]
   * @return [type]                [description]
   */
  public function getPermissions($model)
  {
    return Auth::user()->getPermissions($model);
  }

  /**
   * Check if the current user has the required role
   * @method checkAccess
   * @param  [type]      $role [description]
   * @return [type]            [description]
   */
  public function checkAccess($role)
  {
    return [
      'has_access' => Auth::user()->checkAccess($role)
    ];
  }

  /**
   * Get all checked out records
   *  not by the current user
   * @method getCheckedOutRecords
   * @return [type]               [description]
   */
  public function getCheckedOutRecords($model)
  {
    $class = "App\\{$model}";
    $id = Auth::id();
    return response()->json(RecordLock::with(['user.person'])->ofType($class)->notOfUser($id)->get());//->where('user_id','!=',$id);
  }

  /**
   * Checkout a model for editing
   * @method checkout
   * @param  [type]   $model [description]
   * @param  [type]   $item  [description]
   * @return [type]          [description]
   */
  public function checkout($model,$id)
  {
    $class = "\\App\\{$model}";
    $item = $class::find($id);
    $lock = $item->recordLock;

    if( !Auth::user()->checkAccess( "{$model}.update" ) ) {
      return $this->operationFailed( "You must be logged in as a user with {$model}.update permissions to do that." );
    }

    if ( empty($lock) || $lock->checkExpired() || $lock->checkUser() ) {
      RecordLock::create([
        'lockable_id' => $item->id,
        'lockable_type' => get_class($item),
        'user_id' => \Auth::id()
      ]);

      return $this->operationSuccessful('Record Checked Out For Editing.');
    }

    $user = User::find( $lock->user_id );
    $message = 'That record is checked out by : ' . $user->username;
    return $this->operationFailed( $message );
  }

  /**
   * Checkin a model for editing
   * @method checkout
   * @param  [type]   $model [description]
   * @param  [type]   $item  [description]
   * @return [type]          [description]
   */
  public function checkin($model,$id)
  {
    $class = "\\App\\{$model}";
    $item = $class::findOrFail($id);
    $lock = $item->recordLock;

    if ( !empty($lock) ) {
      $lock->delete();
      return $this->operationSuccessful('Record Checked In.');
    }

    $message = 'That record is already checked in';
    return $this->operationFailed( $message );
  }

  /**
   * Check in all records the user has checked out
   * @method checkinAll
   * @return [type]     [description]
   */
  public function checkinAll()
  {
    $id = Auth::id();

    if ( RecordLock::ofUser($id)->count() ) {
      RecordLock::ofUser($id)->delete();
      return $this->operationSuccessful('All Records Checked In.');
    }  else {
      return $this->operationFailed( 'Nothing to check in' );
    }
  }

  /**
   * The operation was a success
   * @method operationSuccessful
   * @return [type]              [description]
   */
  public function operationSuccessful($message = false)
  {
    return [
      "errors" => false,
      "message" => $message ?: "Operation Completed Successfully"
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
