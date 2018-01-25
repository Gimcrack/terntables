<?php

namespace App;

class Role extends Model
{

  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'roles';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name'
    , 'description'
    , 'model'
    , 'create_enabled'
    , 'read_enabled'
    , 'update_enabled'
    , 'delete_enabled'
  ];

  protected $searchableColumns = [
    'name' => 80,
    'description' => 30,
    'model' => 40,
    'groups.name' => 30,
    'groups.users.username' => 25
  ];

  /**
   * A role can be assigned to many groups
   * @method groups
   * @return [type]  [description]
   */
  public function groups()
  {
    return $this->belongsToMany('App\Group')->withTimestamps();
  }
}
