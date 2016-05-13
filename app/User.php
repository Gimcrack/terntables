<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

use Illuminate\Database\Eloquent\Collection;

use App\Role;
use DB;

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
    protected $fillable = ['username', 'email', 'password', 'people_id', 'comment', 'primary_flag', 'api_token'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    protected $searchableColumns = [
      'username' => 80,
      'email' => 80,
      'person.name' => 30,
      'groups.name' => 20,
      'groups.roles.name' => 20,
    ];

    /**
     * The column that identifies the model
     * @return [type] [description]
     */
    public function identifiableName()
    {
        return $this->name;
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
      return $this->belongsToMany('App\Group')->withTimestamps()->withPivot(['comment','primary_flag'])->with(['roles']);
    }


    /**
     * A user has roles through groups
     * @method roles
     * @return [type]  [description]
     */
    public function roles()
    {
      return $this->hasManyThrough('App\Role','App\Group');
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
     * Does the user have a particular group
     * @method hasGroup
     * @param  [type]   $group [description]
     * @return boolean         [description]
     */
    public function hasGroup($group)
    {
      return (Boolean) ( $this->groups()->where('name',$group)->count() || $this->isAdmin() );
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
        inner join group_role
        on group_user.group_id = group_role.group_id
        inner join roles on
        roles.id = group_role.role_id
        where model = '{$model}'
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
        inner join group_role
        on group_user.group_id = group_role.group_id
        inner join roles on
        roles.id = group_role.role_id
        where model = '{$model}'
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

    /**
     * Get the checked out records of this user
     * @method getCheckedOutRecords
     * @return [type]               [description]
     */
    public function getCheckedOutRecords($class = null)
    {
      $locks = RecordLock::ofUser( $this->id )->ofType($class);
      $collection = new Collection();

      foreach( $locks->get() as $lock ) {
        $model_class = $lock->lockable_type;
        $id = $lock->lockable_id;

        $model = $model_class::find($id);

        if ( !! $model ) {
          $collection->push( $model );
        }

      }

      return $collection;
    }
}
