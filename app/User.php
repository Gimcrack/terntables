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
    protected $fillable = ['name', 'username', 'email', 'password'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];


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
      return explode("\\",$_SERVER['PHP_AUTH_USER'])[1];
    }
}
