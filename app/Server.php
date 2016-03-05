<?php

namespace App;

class Server extends Model
{
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
      'windows_updatable_flag',
      'last_windows_update',
      'group_id',
      'operating_system_id',
      'status'
  ];

  protected $searchableColumns = [
    'name' => 80,
    'cname' => 50,
    'description' => 20,
    'ip' => 30,
    'owner.name' => 40,
    'tags.name' => 20,
    'people.name' => 20,
    'databases.name' => 20,
    'applications.name' => 20,
    'operating_system.name' => 20,
  ];


  /**
   * Get only windows servers
   * @method scopeWindows
   * @param  [type]       $query [description]
   * @return [type]              [description]
   */
  public function scopeWindows($query)
  {
    return $query->whereHas('operating_system', function($q) {
      $q->where('name','like','%windows%')->where('name','not like','%2003');
    });
  }

  /**
   * Get only windows updatable servers
   * @method scopeUpdatable
   * @param  [type]         $query [description]
   * @return [type]                [description]
   */
  public function scopeUpdatable($query)
  {
    return $query->where('windows_updatable_flag',1);
  }

  /**
   * Get only active servers
   * @method scopeActive
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeActive($query)
  {
    return $query->where('inactive_flag',0);
  }

  /**
   * Get only production servers
   * @method scopeProduction
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeProduction($query)
  {
    return $query->where('production_flag',1);
  }

  /**
   * Get only non-production servers
   * @method scopeNonroduction
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeNonproduction($query)
  {
    return $query->where('production_flag',0);
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
    return $this->belongsToMany('App\Person')->withTimestamps()->withPivot(['comment','contact_type']);
  }

  /**
   * A server can serve many applications
   * @method applications
   * @return [type]       [description]
   */
  public function applications()
  {
    return $this->belongsToMany('App\Application')->withTimestamps()->withPivot(['comment','server_type']);
  }

  /**
   * A server can serve many databases
   * @method databases
   * @return [type]       [description]
   */
  public function databases()
  {
    return $this->belongsToMany('App\Database')->withTimestamps()->withPivot(['comment','server_type']);
  }

  /**
   * A server is managaed by one group
   * @method owner
   * @return [type] [description]
   */
  public function owner()
  {
    return $this->belongsTo('App\Group','group_id');
  }

  /**
   * A server has one operating system
   * @method owner
   * @return [type] [description]
   */
  public function operating_system()
  {
    return $this->belongsTo('App\OperatingSystem','operating_system_id');
  }

  /**
   * A server can have many updates
   * @method updates
   * @return [type]  [description]
   */
  public function updates()
  {
    return $this->hasMany('App\UpdateDetail','server_id');
  }
}
