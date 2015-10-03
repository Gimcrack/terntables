<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'modules';

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
     * Polymorphic relationship. Second parameter to morphOne/morphMany
     * should be the same as the prefix for the *_id/*_type fields.
     */
    public function recordLock()
    {
        return $this->morphOne('App\RecordLock', 'lockable');
    }

  /**
   * A module can be assigned to many groups
   * @method modules
   * @return [type]  [description]
   */
  public function groups()
  {
    return $this->belongsToMany('App\Group')->withTimestamps();
  }
}
