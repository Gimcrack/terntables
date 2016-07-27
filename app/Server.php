<?php

namespace App;

class Server extends Model
{
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

  protected $casts = [
    'group_id' => 'int',
    'inactive_flag' => 'int',
    'production_flag' => 'int',
    'windows_updatable_flag' => 'int',
    'operating_system_id' => 'int' 
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

  protected $appends = [
    'identifiable_name',
    'updated_at_for_humans',
    'approved_updates',
    'new_updates'
  ];

  /**
   * Number of updates that have been approved
   * @return [type] [description]
   */
  public function getApprovedUpdatesAttribute()
  {
      return UpdateDetail::where('installed_flag',0)
          ->where('approved_flag',1)
          ->where('hidden_flag',0)
          ->where('superseded_flag',0)
          ->where('server_id',$this->id)
          ->count();
  }

  /**
   * Number of updates that have been not approved
   * @return [type] [description]
   */
  public function getNewUpdatesAttribute()
  {
      return UpdateDetail::where('installed_flag',0)
              ->where('approved_flag',0)
              ->where('server_id',$this->id)
              ->where('superseded_flag',0)
              ->where('hidden_flag',0)
              ->count();
  }

  /**
   * Get only servers with new or approved updates
   * @method scopeHasUpdates
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeHasUpdates($query, $filter = false)
  {
    if ( ! $filter )
    {
      return $query->whereHas('updates', function($q) {
        return $q->where('installed_flag',0)->where('hidden_flag',0);
      });
    }

    return $query->whereRaw('1=1');
  }

  /**
   * Get servers which are late checking in
   * @method scopeLateCheckingIn
   * @param  [type]              $query [description]
   * @return [type]                     [description]
   */
  public function scopeLateCheckingIn($query)
  {
    return $query
      ->active()
      ->hasAgent()
      ->where('last_checkin','<', Carbon::now()->subMinutes(15) );
  }

  /**
   * Get servers which have the agent installed
   *
   * @param      <type>  $query  The query
   * @return     <type>  ( description_of_the_return_value )
   */
  public function scopeHasAgent($query)
  {
    return $query->has('agent');
  }

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
   * A Server can have many services
   *
   * @return     <type>  ( description_of_the_return_value )
   */
  public function services()
  {
    return $this->belongsToMany(Service::class)
      ->withTimestamps()
      ->withPivot(['status', 'start_mode', 'level']);
  }

  /**
   * A Server can have many disks
   * @method disks
   * @return [type] [description]
   */
  public function disks()
  {
    return $this->hasMany(ServerDisk::class);
  }

  /**
   * Get the alerts for the server
   * @method alerts
   * @return [type] [description]
   */
  public function alerts()
  {
    return $this->morphMany(Alert::class,'alertable');
  }

  /**
   * Polymorphic relationship. Second parameter to morphOne/morphMany
   * should be the same as the prefix for the *_id/*_type fields.
   */
  public function tags()
  {
      return $this->morphToMany(Tag::class, 'taggable');
  }

  /**
   * A server can be managed by many people
   * @method people
   * @return [type] [description]
   */
  public function people()
  {
    return $this->belongsToMany(Person::class)
      ->withTimestamps()
      ->withPivot(['comment','contact_type']);
  }

  /**
   * A server can serve many applications
   * @method applications
   * @return [type]       [description]
   */
  public function applications()
  {
    return $this->belongsToMany(Application::class)
      ->withTimestamps()
      ->withPivot(['comment','server_type']);
  }

  /**
   * A server can serve many databases
   * @method databases
   * @return [type]       [description]
   */
  public function databases()
  {
    return $this->belongsToMany(Database::class)
      ->withTimestamps()
      ->withPivot(['comment','server_type']);
  }

  /**
   * A server is managaed by one group
   * @method owner
   * @return [type] [description]
   */
  public function owner()
  {
    return $this->belongsTo(Group::class,'group_id');
  }

  /**
   * A server has one operating system
   * @method owner
   * @return [type] [description]
   */
  public function operating_system()
  {
    return $this->belongsTo(OperatingSystem::class,'operating_system_id');
  }

  /**
   * A server can have many updates
   * @method updates
   * @return [type]  [description]
   */
  public function updates()
  {
    return $this->hasMany(UpdateDetail::class,'server_id');
  }

  /**
   * A server can have one agent
   * @method agent
   *
   * @return   
   */
  public function agent()
  {
      return $this->hasOne(ServerAgent::class);
  }

  /**
   * A server can have many update batches
   * @method update_batches
   * @return [type]         [description]
   */
  public function update_batches()
  {
    return $this->hasMany(UpdateBatch::class,'server_id');
  }

  /**
   * A server can have multiple notifications
   * @method notifications
   * @return [type]        [description]
   */
  public function notifications()
  {
    if ( ! $this->owner )  return collect([]);
    
    return Notification::where('group_id', $this->owner->id )
      ->where('notifications_enabled','<>','None')
      ->get();
  }
}
