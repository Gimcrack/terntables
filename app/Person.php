<?php

namespace App;

class Person extends Model
{

  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'people';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ['name'];

  protected $searchableColumns = [
    'name' => 80,
    'users.username' => 30,
    'users.groups.name' => 30,
    'servers.name' => 30,
    'applications.name' => 30,
    'databases.name' => 30
  ];

  /**
   * A person may have many user accounts
   * @return [type] [description]
   */
  public function users()
  {
      return $this->hasMany('App\User','people_id');
  }

  /**
   * A person can manage many servers
   * @method servers
   * @return [type]  [description]
   */
  public function servers()
  {
    return $this->belongsToMany('App\Server')->withTimestamps();
  }

  /**
   * A person can manage many applications
   * @method servers
   * @return [type]  [description]
   */
  public function applications()
  {
    return $this->belongsToMany('App\Application')->withTimestamps();
  }

  /**
   * A person can manage many servers
   * @method servers
   * @return [type]  [description]
   */
  public function databases()
  {
    return $this->belongsToMany('App\Database')->withTimestamps();
  }

}
