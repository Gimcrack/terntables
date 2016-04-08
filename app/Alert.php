<?php

namespace App;

use Illuminate\Database\Eloquent\Model as BaseModel;

class Alert extends BaseModel
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'alerts';

  protected $fillable = [
    'message',
    'alertable_type',
    'alertable_id',
    'notification_sent_flag',
    'acknowledged_flag'
  ];

  /**
   * Polymorphic relationship
   * @method alertable
   * @return [type]    [description]
   */
  public function alertable()
  {
    return $this->morphTo();
  }

  /**
   * Get only server alerts
   * @method scopeServerAlerts
   * @param  [type]            $query [description]
   * @return [type]                   [description]
   */
  public function scopeServerAlerts($query)
  {
    return $query->where('alertable_type','App\Server');
  }

  /**
   * Get only database alerts
   * @method scopeDatabaseAlerts
   * @param  [type]            $query [description]
   * @return [type]                   [description]
   */
  public function scopeDatabaseAlerts($query)
  {
    return $query->where('alertable_type','App\Database');
  }

  /**
   * Get the alerts that have not had notifications sent
   * @method scopeUnnotified
   * @param  [type]          $query [description]
   * @return [type]                 [description]
   */
  public function scopeUnnotified($query)
  {
    return $query->where('notification_sent_flag',0);
  }

  /**
   * Get unacknowledged alerts
   * @method scopeUnacknowleged
   * @return [type]             [description]
   */
  public function scopeUnacknowleged()
  {
    return $query->where('acknowledged_flag',0);
  }

}
