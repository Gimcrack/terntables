<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract,
                                    AuthorizableContract,
                                    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;

    /**
     * Make the model track revision changes
     */
    use \Venturecraft\Revisionable\RevisionableTrait;

    /**
     * Boot the model
     * @return [type] [description]
     */
    public static function boot()
    {
        parent::boot();
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
     * Track creations as revisions
     * @var [type]
     */
    protected $revisionCreationsEnabled = true;
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['username', 'email', 'password', 'people_id'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * Polymorphic relationship. Second parameter to morphOne/morphMany
     * should be the same as the prefix for the *_id/*_type fields.
     */
    public function recordLock()
    {
        return $this->morphOne('App\RecordLock', 'lockable');
    }

    /**
     * A User may belong to one person
     * @return [type] [description]
     */
    public function person()
    {
      return $this->belongsTo('App\Person','people_id');
    }


    /**
     * A User may belong to many groups
     *
     * @return \belongsToMany
     */
    public function groups()
    {
      return $this->belongsToMany('App\Group')->withTimestamps();
    }

    /**
     * Is user an admin
     *
     * @return boolean
     */
    public function isAdmin()
    {
      return (Boolean)  ( $this->groups()->where('name','Administrators')->count() ) or
              ( $this->groups()->where('name','Super Administrators')->count() );
    }

    /**
     * Is user a super admin
     *
     * @return boolean [description]
     */
    public function isSuperAdmin()
    {
      return (Boolean) ( $this->groups()->where('name','Super Administrators')->count() );
    }


    /**
     * Is user an AD user
     *
     * @return boolean [description]
     */
    public function isADUser()
    {
      return (Boolean) ( $this->groups()->where('name','AD Users')->count() );
    }

    public static function aduser() {
      if (!empty($_SERVER['PHP_AUTH_USER'])) {
        return explode("\\",$_SERVER['PHP_AUTH_USER'])[1];
      } else {
        return false;
      }
    }
}
