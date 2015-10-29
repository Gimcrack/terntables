<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class JobRole extends Model
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
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'jobroles';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name'
    , 'description'
    , 'manager_flag'
    , 'org_id'
    , 'manager_id'
    , 'people_id'
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
   * Polymorphic relationship. Second parameter to morphOne/morphMany
   * should be the same as the prefix for the *_id/*_type fields.
   */
  public function tags()
  {
      return $this->morphToMany('App\Tag', 'taggable');
  }

  /**
   * A jobRole may have a parent org
   * @return [type] [description]
   */
  public function parent()
  {
    return $this->belongsTo('App\Org','org_id');
  }

  /**
   * A jobRole may have a manager
   * @return [type] [description]
   */
  public function manager()
  {
    return $this->belongsTo('App\JobRole','manager_id');
  }

  /**
   * A jobRole may have an occupant
   * @return [type] [description]
   */
  public function occupant()
  {
    return $this->belongsTo('App\Person','people_id');
  }
}
