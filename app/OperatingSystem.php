<?php

namespace App;

use App\Model;

class OperatingSystem extends Model
{
  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'operating_systems';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'name',
  ];

  /**
   * An Operating System may belong to many servers
   * @method servers
   * @return [type]  [description]
   */
  public function servers()
  {
    return $this->hasMany('App\Server');
  }
}
