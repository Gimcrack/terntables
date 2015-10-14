<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
  /**
   * Make the model track revision changes
   */
  use \Venturecraft\Revisionable\RevisionableTrait;

  /**
   * Boot the model
   * @return [type] [description]
   */
  public static function boot()
  {
      parent::boot();
  }

  /**
   * The column that identifies the model
   * @return [type] [description]
   */
  public function identifiableName()
    {
        return $this->name;
    }

  /**
   * Track creations as revisions
   * @var [type]
   */
  protected $revisionCreationsEnabled = true;

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
   * Polymorphic relationship. Second parameter to morphOne/morphMany
   * should be the same as the prefix for the *_id/*_type fields.
   */
  public function recordLock()
  {
      return $this->morphOne('App\RecordLock', 'lockable');
  }


  /**
   * A person may have many user accounts
   * @return [type] [description]
   */
  public function users()
  {
      return $this->hasMany('App\User','people_id');
  }

}
