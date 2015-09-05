<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

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
    return $this->belongsToMany('App\User')->withTimestamps();
  }
}
