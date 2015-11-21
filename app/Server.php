<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Server extends Model
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
  protected $table = 'servers';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name',
      'description',
      'cname',
      'ip',
      'inactive_flag',
      'production_flag',
      'last_windows_update',
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
   * A server can be managed by many people
   * @method people
   * @return [type] [description]
   */
  public function people()
  {
    return $this->belongsToMany('App\Person')->withTimestamps();
  }

  /**
   * A server can serve many applications
   * @method applications
   * @return [type]       [description]
   */
  public function applications()
  {
    return $this->belongsToMany('App\Application')->withTimestamps();
  }

  /**
   * A server can serve many databases
   * @method databases
   * @return [type]       [description]
   */
  public function databases()
  {
    return $this->belongsToMany('App\Database')->withTimestamps();
  }
}
