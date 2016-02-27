<?php

namespace App;

class Update extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'updates';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
  ];

  /**
   * An update detail belongs to one server
   * @method updates
   * @return [type]  [description]
   */
  public function updates()
  {
    return $this->hasMany('App\UpdateDetail','update_details','update_id');
  }
}
