<?php

namespace App;

use Carbon;
use Ingenious\Eloquence\Builder;

class ServerDisk extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'server_disks';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name',
      'server_id',
      'label',
      'size_gb',
      'used_gb',
      'free_gb',
      'inactive_flag',
  ];

  protected $searchableColumns = [
      'name',
      'label',
      'server.name',
  ];

  /**
   * Scope All
   * @method scopeAll
   * @return [type]   [description]
   */
  public function scopeAll( Builder $query )
  {
    return $query->active();
  }

  /**
   * Gets the percent free attribute.
   * 
   * @return float
   */
  public function getPercentFreeAttribute()
  {
    return $this->free_gb / $this->used_gb;
  }

  /**
   * A disk belongs to one server
   * @method server
   * @return [type] [description]
   */
  public function server()
  {
    return $this->belongsTo(Server::class);
  }

    /**
    * A serverDisk can have multiple notifications
    * @method notifications
    * @return [type]        [description]
    */
    public function notifications()
    {
        if ( ! $this->server || ! $this->server->owner )  return collect([]);
        
        return Notification::where('group_id', $this->server->owner->id )
         ->where('notifications_enabled','<>','None')
         ->get();
    }

  /**
   * Get disks with <20GB and <5% free space
   * @method scopeAlmostFull
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeAlmostFull($query)
  {
    return $query
      ->where('free_gb','<',20)
      ->where('size_gb','>',0)
      ->whereRaw('free_gb / size_gb < 0.05');
  }

  /**
   * Get disks with <20GB and <10% free space
   * @method scopeAlmostFull
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeGettingFull($query, $max = 0.2, $min = 0.1)
  {
    return $query
      ->where('free_gb','<',50)
      ->where('size_gb','>',10)
      ->whereRaw("free_gb / size_gb < {$max}")
      ->whereRaw("free_gb / size_gb >= {$min}");
  }

  /**
   * Get server disks which are late checking in
   * @method scopeLateCheckingIn
   * @param  [type]              $query [description]
   * @return [type]                     [description]
   */
  public function scopeLateCheckingIn($query)
  {
      return $query
      ->active()
      ->where('updated_at','<', Carbon::now()->subMinutes(15) );
  }

  /**
   * Get server disks for active servers
   * @method scopeActive
   *
   * @return   void
   */
  public function scopeActive($query)
  {
      return $query->whereHas('server', function($q) {
        return $q->where('inactive_flag',0);
      });
  }

}
