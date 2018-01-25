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
   * A disk belongs to one server
   * @method server
   * @return [type] [description]
   */
  public function server()
  {
    return $this->belongsTo('App\Server');
  }


  /**
   * Get disks with less than 10% free space
   * @method scopeAlmostFull
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeAlmostFull($query)
  {
    return $query->whereRaw('free_gb / size_gb < 0.1');
  }

}
