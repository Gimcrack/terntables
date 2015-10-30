<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Requirement extends Model
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
  protected $table = 'requirements';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name'
    , 'description'
    , 'optional_flag'
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
   * A requirement is managed by one org
   *
   * @return [type] [description]
   */
  public function org()
  {
    return $this->belongsTo('App\Org')->withTimestamps();
  }

  /**
   * A requirement may have many training collections
   * @return [type] [description]
   */
  public function collections()
  {
    return $this->belongsToMany('App\Collection');
  }

  /**
   * A requirement may be required by many job roles
   * @return [type] [description]
   */
  public function jobroles()
  {
    return $this->belongsToMany('App\JobRole');
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
