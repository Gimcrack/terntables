<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;
use Response;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RecordLock;
use App\User;
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
    $this->middleware("checkaccess:{$this->model_short}.update",['only' => ['show','update','checkout'] ]);
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

      array_push($this->with,'RevisionHistory');

      $model = $model_class::with( $this->with )->find($id);

      if ( ! $model ) {
        return $this->notFound();
      }

      $return = $model->toArray();

      $return['readable_history'] = $this->getHistory($model);

      return response()->json( $return );
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

    return $this->operationSuccessful(201);
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

    if ( ! $model ) {
      return $this->notFound();
    }

    if ( ! $model->isCheckedOutToMe() ) {
      return $this->operationRequiresCheckout( $model );
    }

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

    return $this->operationSuccessful(200);

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
    $model = $model_class::find($id);

    if ( ! $model ) {
      return $this->notFound();
    }

    if ( $model->isCheckedOutToSomeoneElse() ) {
      return $this->operationFailed("Delete Failed. That model is checked out to someone else.",409);
    }

    $model->delete();
    return $this->operationSuccessful("{$this->model_short} record deleted.", 200);
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
    $models = $model_class::whereIn('id', $this->getInputIds() );

    if ( ! $models ) {
      return $this->notFound();
    }

    $count = $models->count();
    $message = "{$this->model_short} record(s) deleted.";

    $models->delete();


    return $this->operationSuccessful(compact('message','count'), 200);
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
    return Input::get('ids', null);
  }

  /**
   * Mass update the models with selected ids with the changes
   *
   * @param  int  $id
   * @return Response
   */
  public function massUpdate($ids = null, $changes = null)
  {
    $ids = $ids ?: $this->getInputIds();
    $changes = $changes ?: Input::get('changes', null);

    if ( ! $ids ) {
      return $this->operationFailed('Mass update failed. Please specify what records to change and try again.', 406);
    }

    if ( ! $changes ) {
      return $this->operationFailed('Mass update failed. Please specify what changes to make and try again.', 406);
    }

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
   * Get history on the model
   * @method getHistory
   * @param  [type]     $data [description]
   * @return [type]           [description]
   */
  public function getHistory($data)
  {
    $readable_history = [];

    foreach($data->revisionHistory as $history) {
      $readable_history[] = [
        'date' => date('Y-m-d H:i', strtotime( $history->updated_at )),
        'dateForHumans' => $history->updated_at->diffForHumans(),
        'person' => @$history->userResponsible()->person->name ?: 'System',
        'description' => ( !is_null($history->old_value) ) ?
            "[{$history->fieldName()}] changed from '{$history->oldValue()}' to '{$history->newValue()}'" :
            "Record Created"
      ];
    }

    return $readable_history;

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
    // make sure the user is allowed to checkout the record.
    if( Auth::guest() || !Auth::user()->checkAccess( "{$model}.update" ) ) {
      return $this->notAllowed( "Error checking out {$model} record. You must be logged in as a user with {$model} update permissions to do that." );
    }

    $class = "\\App\\{$model}";
    $item = $class::find($id);

    if ( ! $item ) {
      return $this->notFound();
    }

    $lock = $item->recordLock;

    if ( empty($lock) || $lock->checkExpired() || $lock->checkUser() ) {
      $item->checkoutToId( \Auth::id() );

      return $this->operationSuccessful('Record Checked Out For Editing.', 200);
    }

    $user = User::find( $lock->user_id );
    $message = 'That record is checked out by : ' . $user->username;
    return $this->operationFailed( $message, 410 );
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
    $item = $class::find($id);

    if ( ! $item ) {
      return $this->notFound();
    }

    $lock = $item->recordLock;

    if ( !empty($lock) ) {
      $lock->delete();
      return $this->operationSuccessful('Record Checked In.', 200);
    }

    $message = 'That record is already checked in';
    return $this->operationFailed( $message, 410 );
  }

  /**
   * Check in all records the user has checked out
   * @method checkinAll
   * @return [type]     [description]
   */
  public function checkinAll($model = null)
  {
    $id = Auth::id();
    $class = ( !! $model ) ? "App\\{$model}" : null;

    //dd(RecordLock::all()->toArray());

    if ( !! $class && RecordLock::ofUser($id)->ofType($class)->count() ) {
      $message = "All {$model} records checked in.";
      $count = RecordLock::ofUser($id)->ofType($class)->count();

      RecordLock::ofUser($id)->ofType($model)->delete();
      return $this->operationSuccessful( compact('message', 'count'), 200);
    }

    if ( ! $class && RecordLock::ofUser($id)->count() ) {
      $message = "All records checked in.";
      $count = RecordLock::ofUser($id)->count();

      RecordLock::ofUser($id)->delete();
      return $this->operationSuccessful( compact('message', 'count'), 200);
    }

    return $this->operationFailed( 'Nothing to check in', 410 );
  }

  /**
   * The operation was a success
   * @method operationSuccessful
   * @return [type]              [description]
   */
  public function operationSuccessful($message = false, $statusCode = 200)
  {
    if (is_numeric($message)) {
      $statusCode = $message;
      $message = null;
    }

    if(is_array($message)) {
      $data = array_merge( [
        "errors" => false
      ], $message);
    } else {
      $data = [
        "errors" => false,
        "message" => $message ?: "Operation Completed Successfully"
      ];
    }

    return Response::json($data,$statusCode);
  }

  /**
   * The operation failed
   * @method operationFailed
   * @param  [type]          $e [description]
   * @return [type]             [description]
   */
  public function operationFailed($e, $statusCode = 404)
  {
    if ( is_numeric($e) ) {
        $statusCode = $e;
        $e = null;
    }

    if ( gettype($e) === 'string'  ) {
      $message = $e;
    } else {
      $message = "There was a problem completing your request :" . $e->getMessage();
    }

    $data = [
      "errors" => true,
      "message" => $message,
    ];

    return Response::json($data, $statusCode);
  }


  /**
   * Let the user know the operation they are attempting requires the model
   *  be checked out first
   * @method operationRequiresCheckout
   * @param  [type]                    $model [description]
   * @return [type]                           [description]
   */
  public function operationRequiresCheckout($model)
  {
    if ( $model->isCheckedOutToSomeoneElse() ) {
      return $this->operationFailed( "Error performing action. Someone else has checked out that record.", 409 );
    }
    return $this->operationFailed("Error performing action. Checkout the record and try again.", 405);
  }


  /**
   * Not found standard response
   * @method notFound
   * @return [type]   [description]
   */
  public function notFound()
  {
    return $this->operationFailed("Sorry, I was unable to find a {$this->model_short} with that id.", 404);
  }


  /**
   * Not allowed standard response
   * @method notAllowed
   * @param  [type]     $permission [description]
   * @return [type]                 [description]
   */
  public function notAllowed($message = null, $permission = "update")
  {
    $message = $message ?: "You must be logged in as a user with {$this->model_short} {$permission} permissions to do that.";
    return $this->operationFailed( $message , 403 );
  }

}
