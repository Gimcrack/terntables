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
}
