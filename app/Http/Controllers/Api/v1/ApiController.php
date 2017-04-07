<?php

namespace App\Http\Controllers\Api\v1;

use App\Exceptions\OperationRequiresCheckoutException;
use App\Exceptions\ModelCheckedOutToSomeoneElseException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Response;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RecordLock;
use Input;
use Cache;
use DB;


class ApiController extends Controller
{

  /**
   * The Authenticated user
   */
  public $user;

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
  public $with = [];

  /**
   * Many-To-Many Relationships to save
   * @var [type]
   */
  public $relations = [];

  /**
   * Many-To-One, One-To-One relationships to save
   * @var [type]
   */
  public $belongs = [];

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
   * The columns to select in the query;
   * @var [type]
   */
  public $select = [];

  /**
   * Don't cache views from these model types
   *
   * @var        array
   */
  public $dont_cache = [
    'App\ServerAgent'
  ];

  /**
   * Create a new controller
   */
  public function __construct()
  {
    $this->user = \Auth::guard('api')->user();
  }

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
      $cache_key = $this->getCacheKey();

      $length = $this->shouldCache() ? 60 * 10 : 0;

      $results = Cache::tags([$this->model_class])->remember($cache_key, 60 * 10, function() {
          $input = Input::all();
          $model_class = $this->model_class;

          $filter = $this->parseSearchFilter();

          $with = Input::get('with',$this->with) ?: [];

          $q = Input::get('q',null);
          $scope = Input::get('scope','all');
          $order = Input::get('order','oldest');

          $select = ( !empty( $this->select ) ) ? $this->select : null;

          $models = ( !! $q ) ? $model_class::search( $q )->with($with) : $model_class::with($with);

          $results = $models
                      ->$scope()
                      ->$order()
                      ->whereRaw($filter);

          //$results = ( !! $select ) ? $models->get($select) : $results;

          return $results->paginate( $this->limitPerPage );
      });

      return response()->json( $results );
  }

  /**
   * Should the views be cached
   * @method shouldCache
   *
   * @return   bool
   */
  private function shouldCache()
  {
      return ! in_array($this->model_class, $this->dont_cache);
  }

  /**
   * Get the cache key for the request
   * @method getCacheKey
   *
   * @return   string
   */
  public function getCacheKey()
  {
      return json_encode( request()->all() );
  } 

  /**
   * Forget the keys related to this model
   * @method forgetCacheSection
   *
   * @return   void
   */
  public function forgetCacheSection()
  {
      Cache::tags([$this->model_class])->flush();
  }

  /**
   * Parse the search filter
   * @method parseSearchFilter
   * @return [type]            [description]
   */
  public function parseSearchFilter()
  {
    $filter = Input::get('filter',null);

    if (empty($filter)) {
      return '1=1';
    }

    $id = ( is_object($this->user->person) ) ? $this->user->person->id : null;

    $search = [':user__person__id:'];
    $replace = [$id];

    $filter = str_replace($search,$replace,$filter);

    return $filter;
  }

  /**
   * Display the specified resource in JSON format.
   *
   * @param  int  $id
   * @return Response
   */
  public function show($id)
  {
      $with = Input::get('with',$this->with);

      $model_class = $this->model_class;
      $model = $model_class::with( $with ?: [], 'RevisionHistory' )->findOrFail($id);

      $return = $model->toArray();
      $return['readable_history'] = $this->getHistory($model);

      return response()->json( $return );
  }

  /**
   * Inspect the specified model
   * @method inspect
   * @param  [type]  $model [description]
   * @param  [type]  $id    [description]
   * @return [type]         [description]
   */
  public function inspect($model, $id)
  {
      $classControllers = [
        'Person'  => 'Admin\PersonController',
        'Profile' => 'Admin\UserController',
        'User'    => 'Admin\UserController',
        'Group'   => 'Admin\GroupController',
        'Role'    => 'Admin\RoleController',
        'SilencedNotification'    => 'Admin\SilencedNotificationController',
        'ServerAgent'  => 'Admin\ServerAgentController',
        'ServerDisk'  => 'BI\ServerDiskController',
        'Server'  => 'BI\ServerController',
        'WindowsUpdateServer' => 'BI\ServerController',
        'Application' => 'BI\ApplicationController',
        'Database'    => 'BI\DatabaseController',
        'Outage'      => 'BI\OutageController',
        'OutageTask'  => 'BI\OutageTaskController',
        'OutageTaskDetail' => 'BI\OutageTaskDetailController',
        'Document'    => 'GIS\DocumentController',
        'Notification' => 'Admin\NotificationController',
        'NotificationExemption' => 'Admin\NotificationExemptionController',
        'LogEntry' => 'BI\LogEntryController',
        'DatabaseInstance' => 'BI\DatabaseInstanceController',
      ];

      $class = 'App\Http\Controllers' . "\\" . $classControllers[$model];
      return ( new $class() )->show($id);
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $model_class = $this->model_class;
    $input = array_merge($this->defaults, Input::all() );

    DB::transaction( function() use ($model_class, $input)
    {
      $model = $model_class::create($input)->updateTags();
      $this->handleRelations($model);
    }); // end transaction
    
    $this->forgetCacheSection();

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
    $model_class = $this->model_class;
    $model = $model_class::findOrFail($ids);

    // make sure I have the model checked out before attempting the update
    if ( $this->modelRequiresCheckout( $model ) ) {
      throw new OperationRequiresCheckoutException( $model, 'update' );
    }

    // perform the update as a transaction
    DB::transaction( function() use ($model)
    {
      $model->update( Input::all() );
      $model->updateTags();
      $this->handleRelations($model);
    }); // end transaction

    //Event::fire( new Outage )
    
    $this->forgetCacheSection();

    return $this->operationSuccessful(200);

  }

  /**
   * Remove the specified resource(s) from storage.
   *
   * @param  int  $id
   * @return \Illuminate\Http\Response
   */
  public function destroy($id = null)
  {
    $model_class = $this->model_class;
    $models = ( !! $id ) ?
      $model_class::findOrFail($id) :
      $model_class::whereIn('id', $this->getInputIds() );;

    // make sure the collection is not empty
    if ( ! $models ) {
      throw new ModelNotFoundException();
    }

    // make sure no one has any of the models checked out
    foreach($models->get() as $model) {
      if ( $model->isCheckedOutToSomeoneElse() ) {
        throw new ModelCheckedOutToSomeoneElseException($model, 'delete');
      }
    }

    // prepare the response
    $count = $models->count();
    $message = "{$this->model_short} record(s) deleted.";

    // delete the records
    $models->delete();

    $this->forgetCacheSection();

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

    // handle m-m relations
    foreach($this->relations as $relation) {
      if ( isset($input[$relation]) && method_exists( $model, $relation ) ) {
          $this->handleRelation($model, $relation);
      }
    }

    // handle 1-m and 1-1 relations
    foreach ($this->belongs as $belongs) {
        $this->handleBelongs( $model, $belongs );
    }

  }

  /**
   * Handle model belongs
   * @method handleBelongs
   * @param  [type]        $model    [description]
   * @param  [type]        $relation [description]
   * @return [type]                  [description]
   */
  public function handleBelongs($model, $relation)
  {
    $input = Input::all();

    $tmp_model_class = $relation['model'];
    $ids = Input::get( $relation['key'], [] );

    // remove existing attachments
    $tmp_model_class::where( $relation['foreign_key'], $model->id )
      ->update( $relation['reset'] ?: [] );

    if ( empty($ids) ) return false;

    foreach( $ids as $index => $value) {
      $find = ( is_numeric($value) ) ? $value : $index;
      $update = ( is_numeric($value) ) ? [] : $value;
      $update = array_merge( [ $relation['foreign_key'] => $model->id ], $update );

      $tmp_model_class::find( $find )
        ->update( $update );
    }

    $this->forgetCacheSection();

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
    return $model->$relation()->sync( $sync ?: [] );

    $this->forgetCacheSection();
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
  public function massUpdate($ids = null, $changes = null, $class = null)
  {
    $ids = $ids ?: $this->getInputIds();
    $changes = $changes ?: Input::get('changes', null);
    $class = $class ?: $this->model_class;

    if ( ! $ids || ! $changes ) {
      throw new InvalidArgumentException();
      //return $this->operationFailed('Mass update failed. Please specify what records to change and try again.', 406);
    }

    // if ( ! $changes ) {
    //   return $this->operationFailed('Mass update failed. Please specify what changes to make and try again.', 406);
    // }

    $models = $class::whereIn('id',$ids);

    if ( ! $models->count() ) {
      throw new ModelNotFoundException();
    }

    $models->update($changes);

    $this->forgetCacheSection();

    return $this->operationSuccessful();
  }

  /**
   * Get select options for a model
   * @param  [type] $model   [description]
   * @param  [type] $options [description]
   * @param  [type] $labels  [description]
   * @return [type]          [description]
   */
  public function getSelectOptions($model,$options,$labels = [], $scope='all')
  {
    $class = "\\App\\{$model}";
    if (empty($labels)) { $labels = $options; }

    $select = explode(",",$labels);

    $ret = [];
    foreach( $class::all()->$scope() as $o ) {
      $ret2 = [];
      $ret2['label'] = [];
      $ret2['option'] = $o->$options;

      foreach( $select as $key ) {
        $ret2['label'][] = $o->$key;
      }
      $ret2['label'] = implode(".",$ret2['label']);
      $ret[] = $ret2;
    }

    usort( $ret, function($a,$b) {
      $al = $a['label'];
      $bl = $b['label'];

      if ($al > $bl) return 1;
      if ($al < $bl) return -1;
      return 0;

    });

    return response()->json($ret);
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
    return $this->user->getPermissions($model);
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
      'has_access' => $this->user->checkAccess($role)
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
    $id = $this->user->id;
    return response()->json(RecordLock::with(['user.person'])->ofType($class)->notOfUser($id)->get());//->where('user_id','!=',$id);
  }

  /**
   * Does the model require checkout?
   *
   * @param      <type>  $model  The model
   */
  private function modelRequiresCheckout( $model )
  {
    switch( app()->environment() )
    {
      case 'testing' :
        return ( ! $model->isCheckedOutToMe() );

    }

    return ( ! $model->isCheckedOutToMe()  ) &&
           ( ! \Auth::guard('api')->user()->isAdmin() );
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
    if( \Auth::guard('api')->guest() || !$this->user->checkAccess( "{$model}.update" ) ) {
      return $this->notAllowed( "Error checking out {$model} record. You must be logged in as a user with {$model} update permissions to do that." );
    }

    $class = "\\App\\{$model}";
    $item = $class::findOrFail($id);

    if ( $item->cannotBeCheckedOut() ) {
      throw new ModelCheckedOutToSomeoneElseException($item, 'checkout');
    }

    $item->checkoutToMe();
    return $this->operationSuccessful('Record Checked Out For Editing.', 200);
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

    // attempt to checkin the item
    if ( ! $item->checkin() ) {
      throw new ItemCheckinException($item);
    }

    return $this->operationSuccessful('Record Checked In.', 200);
  }

  /**
   * Check in all records the user has checked out
   * @method checkinAll
   * @return [type]     [description]
   */
  public function checkinAll($model = null)
  {
    $class = ( !! $model ) ? "App\\{$model}" : null;

    // get checked out models
    $models = $this->user->getCheckedOutRecords($class);
    $count = $models->count();

    // make sure there is something to be checked in
    if ( ! $count ) {
      throw new OperationRequiresCheckoutException(null, 'checkin');
    }

    // perform the checkin
    DB::transaction( function() use ($models)
    {
      foreach($models as $model) {
        $model->checkin();
      }
    });

    // prepare the message
    $model_message = ( !! $model ) ? " {$model} " :  " ";
    $message = "All{$model_message}records checked in.";

    return $this->operationSuccessful( compact('message', 'count'), 200);
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
