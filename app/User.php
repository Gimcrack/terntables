<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

use App\Module;
use DB;

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
      return $this->belongsToMany('App\Group')->withTimestamps()->with(['modules']);
    }


    /**
     * A user has modules through groups
     * @method modules
     * @return [type]  [description]
     */
    public function modules()
    {
      return $this->hasManyThrough('App\Module','App\Group');
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

    /**
     * Check if the logged in user has the required access
     * @method checkAccess
     * @param  [type]      $role [description]
     * @return [type]            [description]
     */
    public function checkAccess($role)
    {
      if ($this->isAdmin()) return 1;

      list($model,$permission) = explode('.',$role);

      $select = "
        select count(*) as access
        from group_user
        inner join group_module
        on group_user.group_id = group_module.group_id
        inner join modules on
        modules.id = group_module.module_id
        where name = '{$model}'
        and {$permission}_enabled = 1
        and group_user.user_id = {$this->id}";

      $access = DB::select( DB::raw("$select" ) );

      return (int) $access[0]->access;

    }

    /**
     * Get permissions on the specified model
     * @method checkAccess
     * @param  [type]      $model [description]
     * @return [type]            [description]
     */
    public function getPermissions($model)
    {
      $create_enabled = 0;
      $read_enabled = 0;
      $update_enabled = 0;
      $delete_enabled = 0;

      if ($this->isAdmin()) {
        return [
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1
        ];
      }

      $select = "
        select distinct
          create_enabled,
          read_enabled,
          update_enabled,
          delete_enabled
        from group_user
        inner join group_module
        on group_user.group_id = group_module.group_id
        inner join modules on
        modules.id = group_module.module_id
        where name = '{$model}'
        and group_user.user_id = {$this->id}";

      $access = DB::select( DB::raw("$select" ) );

      foreach ($access as $row) {
        $create_enabled = ( !!$row->create_enabled ) ? 1 : $create_enabled;
        $read_enabled = ( !!$row->read_enabled ) ? 1 : $read_enabled;
        $update_enabled = ( !!$row->update_enabled ) ? 1 : $update_enabled;
        $delete_enabled = ( !!$row->delete_enabled ) ? 1 : $delete_enabled;
      }

      return  [
        'create_enabled' =>  $create_enabled,
        'read_enabled' => $read_enabled,
        'update_enabled' => $update_enabled,
        'delete_enabled' => $delete_enabled
      ];

    }
}
