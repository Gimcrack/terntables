<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Database extends Model
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
  protected $table = 'databases';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name',
      'description',
      'rpo',
      'rto',
      'production_flag',
      'inactive_flag',
      'ignore_flag',
      'dr_strategy',
      'ha_strategy',
      'upgrade_readiness',
      'server_id'
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
   * A database can be managed by many people
   * @method people
   * @return [type] [description]
   */
  public function people()
  {
    return $this->belongsToMany('App\Person')->withTimestamps();
  }

  /**
   * A database can serve many applications
   * @method applications
   * @return [type]       [description]
   */
  public function applications()
  {
    return $this->belongsToMany('App\Application')->withTimestamps();
  }

  /**
   * A database can belong to multiple servers
   * @method servers
   * @return [type]  [description]
   */
  public function servers()
  {
    return $this->belongsToMany('App\Server')->withTimestamps();
  }

  /**
   * A database can is hosted by one server
   * @method servers
   * @return [type]  [description]
   */
  public function host()
  {
    return $this->belongsTo('App\Server','server_id');
  }
}
