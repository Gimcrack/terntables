<?php

namespace App;

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
  ];

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
    return $this->belongsTo('App\Server');
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
  public function scopeGettingFull($query)
  {
    return $query
      ->where('free_gb','<',50)
      ->where('size_gb','>',0)
      ->whereRaw('free_gb / size_gb < 0.20');
  }

}
