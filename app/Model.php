<?php

namespace App;

use Illuminate\Database\Eloquent\Model as BaseModel;
use Input;
use App\Tag;
use App\Exceptions\OperationRequiresCheckoutException;
use Symfony\Component\Debug\Exception\FatalErrorException;
use \Venturecraft\Revisionable\RevisionableTrait as RevisionableTrait;
use Carbon\Carbon;
use Ingenious\Eloquence\Eloquence;

abstract class Model extends BaseModel
{
  /**
   * Make the model track revision changes
   */
  use RevisionableTrait, Eloquence;

  protected $appends = [
    'identifiable_name',
    'updated_at_for_humans'
  ];

  /**
   * Boot the model
   * @return [type] [description]
   */
  public static function boot()
  {
      parent::boot();
  }

  /**
   * Scope All
   * @method scopeAll
   * @return [type]   [description]
   */
  public function scopeAll($query)
  {
    return $query->whereRaw('1=1');
  }

  /**
   * Scope None
   * @method scopeAll
   * @return [type]   [description]
   */
  public function scopeNone($query)
  {
    return $query->whereRaw('1=0');
  }

  /**
   * The column that identifies the model
   * @return [type] [description]
   */
  public function identifiableName()
  {
      return $this->name;
  }

  /**
   * Return the original attributes
   */
  public function getBaseAtts()
  {
    return array_intersect_key($this->toArray(), array_flip($this->fillable));  
  }

  /**
   * The column that identifies the model
   * @return [type] [description]
   */
  public function getIdentifiableNameAttribute()
  {
      return $this->identifiableName();
  }

  /**
   * Get the updated at for humans
   * @method updatedAtForHumans
   * @return [type]             [description]
   */
  public function getUpdatedAtForHumansAttribute()
  {
    try {
      if (is_object($this->updated_at)) {
        return $this->updated_at->diffForHumans();
      } elseif ( !empty($this->updated_at) ) {
        return Carbon::createFromFormat('Y-m-d G:i:s.000', $this->updated_at )->diffForHumans();

      }

      return null;

    }

    catch(Exception $e) {
      return null;
    }


  }

  /**
   * Track creations as revisions
   * @var [type]
   */
  protected $revisionCreationsEnabled = true;

  /**
   * Polymorphic relationship. Second parameter to morphOne/morphMany
   * should be the same as the prefix for the *_id/*_type fields.
   */
  public function recordLock()
  {
      return $this->morphOne('App\RecordLock', 'lockable');
  }

  /**
   * Is the record checked out
   * @method isCheckedOut
   * @return boolean      [description]
   */
  public function isCheckedOut()
  {
    return ( !! $this->recordLock );
  }

  /**
   * Is the model checked out to me
   * @method isCheckedOutToMe
   * @return boolean          [description]
   */
  public function isCheckedOutToMe()
  {
    if ( ! $this->recordLock ) {
      return false;
    }

    return $this->recordLock->isSameUser();
  }


  /**
   * [getColumns description]
   * @method getColumns
   * @return [type]     [description]
   */
  public static function getColumns()
  {
    $model = static::first();
    $ret = [];
    $table = $model->getTable();
    foreach ( array_keys($model->getAttributes()) as $key ) {
      $ret[] = $table . "." .$key;
    }
    return $ret;
  }

  /**
   * Is the model checked out to someone else
   * @method isCheckedOutToSomeoneElse
   * @return boolean          [description]
   */
  public function isCheckedOutToSomeoneElse()
  {
    if ( ! $this->recordLock ) {
      return false;
    }

    return ! $this->recordLock->isSameUser();
  }

  /**
   * Checkout this model to the specified id
   * @method checkoutToId
   * @param  [type]       $id [description]
   * @return [type]           [description]
   */
  public function checkoutToId($id)
  {
    RecordLock::create([
      'lockable_id' => $this->id,
      'lockable_type' => get_class($this),
      'user_id' => $id
    ]);

    return $this;
  }

  /**
   * Return attributes formatted for humans
   * @method attributesForHumans
   * @return [type]              [description]
   */
  public function attributesForHumans()
  {
    $atts = $this->toArray();
    return $this->flattenToList($atts);
  }

  /**
   * Flatten the array to a list
   * @method flattenToList
   * @param  [type]        $val [description]
   * @return [type]             [description]
   */
  public function flattenToList($arr)
  {
    $return = [];
    $readable_keys = $this->readableKeys($arr);

    $return[] = '<table class="table table-striped">';


    foreach($arr as $key => $value ) {
      if ( $this->shouldIgnoreKey($key) ) continue;
      if ( !isset($readable_keys[$key]) ) continue;

      $return[] = '<tr>';
      $return[] = '<th style="text-align:left">';
      $return[] = $readable_keys[$key];
      $return[] = '</th>';
      $return[] = '<td>';
      $return[] = $this->readableValue( $value, $key );
      $return[] = '</td>';
      $return[] = '</tr>';
    }

    $return[] = '</table>';

    return implode("\n",$return);
  }

  /**
   * Return the key in a readable format
   * @method readableKey
   * @param  [type]      $key [description]
   * @return [type]           [description]
   */
  public function readableKey($key)
  {
    $search = [ "_", "_at", " at", "_flag", " flag", "pivot" ];
    $replace = [ " ", "", "", "", "", "relationship" ];

    switch(true) {
      case ( strpos($key,"_at") !== false ) :
        return ucwords( "Date " . str_replace($search, $replace, $key) );

      case ( strpos($key,"_flag") !== false ) :
        return ucwords ( "Is " . str_replace($search, $replace, $key) . "?" );

      default :
        return ucwords ( str_replace($search, $replace, $key) );
    }

  }

  /**
   * Return the value in a readable format
   * @method readableValue
   * @param  [type]        $value [description]
   * @param  [type]        $key   [description]
   * @return [type]               [description]
   */
  public function readableValue( $value, $key )
  {
    switch(true) {
      case ( strpos($key,"_at") !== false ) :
        return date('Y-m-d H:i',strtotime($value));

      case ( strpos($key,"_flag") !== false ) :
        return ( !! $value ) ? "Yes" : "No";

      case ( $key === 'pivot' ) :
        return $this->pivotExtractType($value);

      case (is_array($value)) :
        return $this->arrayToTable( $value );

      default :
        return $value;
    }

  }

  /**
   * [pivotExtractType description]
   * @method pivotExtractType
   * @param  [type]           $arr [description]
   * @return [type]                [description]
   */
  public function pivotExtractType($arr)
  {
    $return = '';
    foreach($arr as $key => $value) {
      if (strpos($key,'type') !== false) {
        $return .= $this->readableKey($key) . " : " . $value;
      }
    }

    return $return;
  }

  /**
   * Render an array as a tbale
   * @method arrayToTable
   * @return [type]       [description]
   */
  public function arrayToTable($arr)
  {
    // check for multi-dimensional array
    if ( !empty($arr[0]) && is_array($arr[0]) ) {
      return $this->multidimensionalArrayToTable( $arr );
    }

    $return=[];
    //setup the table
    $return[] = '<table class="table table-striped">';
    foreach( $arr as $cell_key => $cell ) {
      if ( $this->shouldIgnoreKey($cell_key) ) continue;
      $return[] = '<tr>';
      $return[] = "<th>{$this->readableKey($cell_key)}</th>";
      $return[] = "<td>{$this->readableValue($cell, $cell_key)}</td>";
      $return[] = '<tr>';
    }
    $return[] = '</table>';

    return implode("\n",$return);

  }

  /**
   * Render a multi-dimensional array as a table
   * @method multidimensionalArrayToTable
   * @param  [type]                       $value [description]
   * @return [type]                              [description]
   */
  public function multidimensionalArrayToTable( $value )
  {
    $return=[];

    //setup the table
    $return[] = '<table class="table table-striped">';

    // setup the headers
    $return[] = '<tr>';
    foreach( array_keys($value[0]) as $header ) {
      if ( $this->shouldIgnoreKey($header) ) continue;
      $return[] = "<th>{$this->readableKey($header)}</th>";
    }
    $return[] = '</tr>';

    // fill in the body
    foreach( $value as $row ) {
      $return[] = '<tr>';
      foreach($row as $cell_key => $cell) {
        if ( $this->shouldIgnoreKey($cell_key) ) continue;
        if ($cell_key === 'pivot') {
          $return[] = '<td>';
          $return[] = $this->pivotExtractType($cell);
          $return[] = '</td>';
        }
        elseif (is_array($cell)) {
          $return[] = '<td>';
          $return[] = implode(", ", array_column($cell,'name'));
          $return[] = '</td>';
        } else {
          $return[] = "<td>{$this->readableValue( $cell, $cell_key )}</td>";
        }
      }
      $return[] = '</tr>';
    }

    $return[] = '</table>';

    return implode("\n", $return);
  }

  /**
   * Should the key be ignored
   * @method shouldIgnoreKey
   * @param  [type]          $key [description]
   * @return [type]               [description]
   */
  public function shouldIgnoreKey($key)
  {
    switch(true) {
      case ( $key === 'id' ) :
      case ( strpos($key,'_id') !== false ) :
      //case ( $key === 'pivot' ) :
        return true;
    }
    return false;
  }

  /**
   * Iterate through the keys and return the readable version of each
   * @method readableKeys
   * @param  [type]       $arr [description]
   * @return [type]            [description]
   */
  public function readableKeys($arr)
  {
    $return = [];
    foreach(array_keys($arr) as $key) {
      if ($key === 'id' || strpos($key,'id') !== false) continue;
      $readableKey = $this->readableKey($key);
      $return[$key] = "<th>{$readableKey}</th>";
    }
    return $return;
  }

  /**
   * Checkout this model to the logged in user
   * @method checkoutToMe
   * @return [type]       [description]
   */
  public function checkoutToMe( $guard = 'api' )
  {
    return $this->checkoutToId( \Auth::guard($guard)->user()->id );
  }

  /**
   * Checkin the model
   * @method checkin
   * @return [type]  [description]
   */
  public function checkin()
  {
    if ( ! $this->isCheckedOutToMe() ) {
      throw new OperationRequiresCheckoutException($this, 'checkin');
    }

    $this->recordLock->delete();

    return true;
  }

  /**
   * Can this model be checked out
   * @method canBeCheckedOut
   * @return [type]          [description]
   */
  public function canBeCheckedOut()
  {
    $lock = $this->recordLock;
    return ( empty($lock) || $lock->checkExpired() || $lock->checkUser() );
  }

  /**
   * Can this model not be checked out
   * @method cannotBeCheckedOut
   * @return [type]             [description]
   */
  public function cannotBeCheckedOut()
  {
    return ! $this->canBeCheckedOut();
  }

  /**
   * Get the user that the record is checked out to
   * @method checkedOutToUser
   * @return [type]           [description]
   */
  public function checkedOutToUser()
  {
    if ( ! $this->isCheckedOut() ) {
      return null;
    }

    $id = $this->recordLock->user_id;

    return \App\User::find($id);
  }

  /**
   * Update tags for the model
   * @method updateTags
   * @return [type]     [description]
   */
  public function updateTags()
  {
    if ( ! method_exists($this, 'tags') ) return $this;

    $tags = Input::get('tags', [] );
    Tag::resolveTags( $this, $tags );

    return $this;
  }

}
