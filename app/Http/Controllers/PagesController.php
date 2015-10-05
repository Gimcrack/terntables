<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RecordLock;
use DB;

class PagesController extends Controller
{

    /**
     * Construct a new PagesController
     * @method __construct
     */
    public function __construct()
    {
      $this->middleware('auth');
    }

    /**
     * The home view
     * @method home
     * @return /View
     */
    public function home()
    {
      return view('pages.home');
    }

    /**
     * Get select options for a model
     * @param  [type] $model   [description]
     * @param  [type] $options [description]
     * @param  [type] $labels  [description]
     * @return [type]          [description]
     */
    public function optionsjson($model,$options,$labels = [])
    {
      $class = "\\App\\{$model}";
      if (empty($labels)) { $labels = $options; }

      return $class::select("{$options} as option", DB::raw("{$labels} as label"))->orderBy("label","ASC")->get();
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

      if ( empty($lock) || $lock->checkExpired() || $lock->checkUser() ) {
        try {
          RecordLock::create([
            'lockable_id' => $item->id,
            'lockable_type' => get_class($item),
            'user_id' => \Auth::id()
          ]);

          return $this->operationSuccessful();

        } catch(\Illuminate\Database\QueryException $e) {
          return $this->operationFailed($e);
        }
      }

      $user = \App\User::find( $lock->user_id );
      $message = 'That record is checked out by : ' . $user->name;
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
        try {
          $lock->delete();
          return $this->operationSuccessful();

        } catch(\Illuminate\Database\QueryException $e) {
          return $this->operationFailed($e);
        }
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
      try {
        $id = \Auth::id();

        if ( RecordLock::ofUser($id)->count() ) {
          RecordLock::ofUser($id)->delete();
          return $this->operationSuccessful();
        }  else {
          return $this->operationFailed( 'Nothing to check in' );
        }
      } catch(\Illuminate\Database\QueryException $e) {
        return $this->operationFailed($e);
      }
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
      $id = \Auth::id();
      return RecordLock::with(['User'])->ofType($class)->notOfUser($id)->get();//->where('user_id','!=',$id);
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
      if ( gettype($e) === 'string' ) {
        return [
          "errors" => true,
          "message" => "There was a problem completing your request: " . $e,
        ];
      } else {
        return [
          "errors" => true,
          "message" => "There was a problem completing your request: " . $e->getMessage(),
        ];
      }
    }



}
