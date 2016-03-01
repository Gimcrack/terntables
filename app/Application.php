<?php

namespace App;

class Application extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'applications';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name',
      'description',
      'inactive_flag',
      'group_id'
  ];

  protected $searchableColumns = [
    'name' => 80,
    'description' => 20,
    'owner.name' => 20,
    'tags.name' => 10,
    'people.name' => 10,
    'servers.name' => 10,
    'databases.name' => 10
  ];

  /**
   * Get only active applications
   * @method scopeActive
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeActive($query)
  {
    return $query->where('inactive_flag',0);
  }

  /**
   * An application is managaed by one group
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
   * A application can be managed by many people
   * @method people
   * @return [type] [description]
   */
  public function people()
  {
    return $this->belongsToMany('App\Person')->withTimestamps()->withPivot(['contact_type','comment']);
  }

  /**
   * An application may have many servers
   * @method servers
   * @return [type]  [description]
   */
  public function servers()
  {
    return $this->belongsToMany('App\Server')->withTimestamps()->withPivot(['server_type','comment']);
  }

  /**
   * A server can serve many databases
   * @method databases
   * @return [type]       [description]
   */
  public function databases()
  {
    return $this->belongsToMany('App\Database')->withTimestamps()->withPivot(['database_type','comment']);
  }
}
