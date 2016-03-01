<?php

namespace App;

class Group extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'groups';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name'
    , 'description'
  ];

  protected $searchableColumns = [
    'name' => 80,
    'description' => 20,
    'users.username' => 20,
    'roles.name' => 10,
    'roles.model' => 10,
    'servers.name' => 10,
    'applications.name' => 10,
    'databases.name' => 10
  ];

  /**
   * A group is comprised of many users
   *
   * @return [type] [description]
   */
  public function users()
  {
    return $this->belongsToMany('App\User')->withTimestamps()->withPivot(['comment','primary_flag']);
  }

  /**
   * A group can be assigned to many roles
   * @method roles
   * @return [type]  [description]
   */
  public function roles()
  {
    return $this->belongsToMany('App\Role')->withTimestamps();
  }

  /**
   * A groups can own many servers
   * @method servers
   * @return [type]  [description]
   */
  public function servers()
  {
    return $this->hasMany('App\Server');
  }

  /**
   * A groups can own many applications
   * @method servers
   * @return [type]  [description]
   */
  public function applications()
  {
    return $this->hasMany('App\Application');
  }

  /**
   * A groups can own many databases
   * @method servers
   * @return [type]  [description]
   */
  public function databases()
  {
    return $this->hasMany('App\Database');
  }
}
