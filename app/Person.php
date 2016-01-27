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

}
