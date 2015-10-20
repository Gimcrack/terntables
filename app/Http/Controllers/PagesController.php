<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RecordLock;
use DB;
use Auth;
use App\User;

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
      if ( !Auth::check() ) {
        return redirect('/auth/login');
      }
      return redirect('/documents');
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

      return response()->json( $class::select("{$options} as option", DB::raw("{$labels} as label"))->orderBy("label","ASC")->get() );
    }

    /**
     * Get token options for a model
     * @param  [type] $model   [description]
     * @param  [type] $options [description]
     * @param  [type] $labels  [description]
     * @return [type]          [description]
     */
    public function tokensjson($model,$options,$labels = [])
    {
      $class = "\\App\\{$model}";
      if (empty($labels)) { $labels = $options; }
      $q = \Input::get('q') ?: '';

      return response()->json( $class::select("{$options} as id", DB::raw("{$labels} as name"))->where( $labels,'like', "%{$q}%" )->orderBy("name","ASC")->get() );
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
        RecordLock::create([
          'lockable_id' => $item->id,
          'lockable_type' => get_class($item),
          'user_id' => \Auth::id()
        ]);

        return $this->operationSuccessful();
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
        return $this->operationSuccessful();
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
        return $this->operationSuccessful();
      }  else {
        return $this->operationFailed( 'Nothing to check in' );
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
      $id = Auth::id();
      return RecordLock::with(['user.person'])->ofType($class)->notOfUser($id)->get();//->where('user_id','!=',$id);
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
     * Get all user permissions on the specified model
     * @method getPermissions
     * @param  [type]         $model [description]
     * @return [type]                [description]
     */
    public function getPermissions($model)
    {
      return Auth::user()->getPermissions($model);
    }


}
