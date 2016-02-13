<?php

namespace App;

class Database extends Model
{
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
    return $this->belongsToMany('App\Person')->withTimestamps()->withPivot(['contact_type','comment']);
  }

  /**
   * A database can serve many applications
   * @method applications
   * @return [type]       [description]
   */
  public function applications()
  {
    return $this->belongsToMany('App\Application')->withTimestamps()->withPivot(['database_type','comment']);
  }

  /**
   * A database can belong to multiple servers
   * @method servers
   * @return [type]  [description]
   */
  public function servers()
  {
    return $this->belongsToMany('App\Server')->withTimestamps()->withPivot(['server_type','comment']);
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

  /**
   * Get the hostname of the Database
   * @method getHostnameAttribute
   * @return [type]               [description]
   */
  public function getHostnameAttribute()
  {
    return $this->host->name;
  }
}
