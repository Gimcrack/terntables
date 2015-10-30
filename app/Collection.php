<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
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
  protected $table = 'collections';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name'
    , 'description'
    , 'org_id'
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
   * A resource is managed by one Org
   *
   * @return [type] [description]
   */
  public function org()
  {
    return $this->belongsTo('App\Org');
  }

  /**
   * A collection can have many resources
   * @return [type] [description]
   */
  public function resources()
  {
    return $this->belongsToMany('App\Resource')->withTimestamps();
  }

  /**
   * A collection can have many requirements
   * @return [type] [description]
   */
  public function requirements()
  {
    return $this->belongsToMany('App\Requirement')->withTimestamps();
  }

  /**
   * Polymorphic relationship. Second parameter to morphOne/morphMany
   * should be the same as the prefix for the *_id/*_type fields.
   */
  public function tags()
  {
      return $this->morphToMany('App\Tag', 'taggable');
  }
}
