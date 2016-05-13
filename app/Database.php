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

  protected $searchableColumns = [
    'name' => 80,
    'description' => 20,
    'owner.name' => 20,
    'tags.name' => 10,
    'people.name' => 10,
    'servers.name' => 10,
    'applications.name' => 10
  ];

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
      'server_id',
      'group_id'
  ];

  protected $casts = [
    'group_id' => 'int',
    'ignore_flag' => 'int',
    'production_flag' => 'int',
    'inactive_flag' => 'int',
    'server_id' => 'int'
  ];

  /**
   * Get only active databases
   * @method scopeActive
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeActive($query)
  {
    return $query->where('inactive_flag',0)->where('ignore_flag',0);
  }

  /**
   * Get only production databases
   * @method scopeProduction
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeProduction($query)
  {
    return $query->where('production_flag',1)->where('ignore_flag',0);
  }

  /**
   * Get only non-production databases
   * @method scopeNonroduction
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeNonproduction($query)
  {
    return $query->where('production_flag',0)->where('ignore_flag',0);
  }

  /**
   * Polymorphic relationship. Second parameter to morphOne/morphMany
   * should be the same as the prefix for the *_id/*_type fields.
   */
  public function recordLock()
  {
      return $this->morphOne('App\RecordLock', 'lockable');
  }

  /**
   * A database is managaed by one group
   * @method owner
   * @return [type] [description]
   */
  public function owner()
  {
    return $this->belongsTo('App\Group','group_id');
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

  /**
   * Get the alerts for the server
   * @method alerts
   * @return [type] [description]
   */
  public function alerts()
  {
    return $this->morphMany('App\Alert','alertable');
  }
}
