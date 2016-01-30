<?php

namespace App;

use Illuminate\Database\Eloquent\Model as BaseModel;

class RecordLock extends BaseModel
{

    /**
     * The mass assignable fields
     *
     * @var array
     */
    protected $fillable = [
        'lockable_id'
      , 'lockable_type'
      , 'user_id'
    ];

    /**
     * Polymorphic relationship. Name of the relationship should be
     * the same as the prefix for the *_id/*_type fields.
     */
    public function lockable()
    {
        return $this->morphTo();
    }

    /**
     * Scope of lockable type
     * @param  [type] $query [description]
     * @param  [type] $type  [description]
     * @return [type]        [description]
     */
    public function scopeOfType($query,$type = null)
    {
      if (! $type ) return $query;
      
      return $query->where('lockable_type',$type);
    }


    /**
     * Scope of user - get recordlocks
     * of a particular user
     * @param  [type] $query   [description]
     * @param  [type] $user_id [description]
     * @return [type]          [description]
     */
    public function scopeOfUser($query,$user_id)
    {
      return $query->where('user_id',$user_id);
    }

    /**
     * Scope not of user - get record locks
     * not belonging to a particular user
     * @param  [type] $query   [description]
     * @param  [type] $user_id [description]
     * @return [type]          [description]
     */
    public function scopeNotOfUser($query,$user_id)
    {
      return $query->where('user_id','<>',$user_id);
    }

    /**
     * Relationship to user.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }


    /**
     * Check if the lock expired
     * @method isExpired
     * @return boolean   [description]
     */
    public function checkExpired()
    {
      if ( $this->isExpired() ) {
        $this->delete();
        return true;
      }
    }

    /**
     * Check if the lock expired
     * @method isExpired
     * @return boolean   [description]
     */
    public function isExpired()
    {
      return $this->created_at->diffInMinutes() > env('MAX_RECORD_CHECKOUT_MINUTES',10);
    }

    /**
     * Check to see if the same user is checking out
     * the record again
     * @method checkUser
     * @return [type]    [description]
     */
    public function checkUser()
    {
      if ( $this->isSameUser() ) {

        $this->delete();
        return true;
      }
    }

    public function isSameUser()
    {
      return (Boolean) ($this->user_id === \Auth::id() );
    }
}
