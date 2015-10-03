<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RecordLock extends Model
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
