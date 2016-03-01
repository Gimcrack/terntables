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

  protected $searchableColumns = [
    'title' => 80,
    'kb_article' => 30,
    'description' => 20,
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
