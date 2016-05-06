<?php

namespace App;

class Alert extends Model
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

  protected $appends = [
    'updated_at_for_humans',
    'name'
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
   * Get name attribute
   * @method getNameAttribute
   * @return [type]           [description]
   */
  public function getNameAttribute()
  {
    return $this->alertable->identifiableName;
  }

  /**
   * Get the updated at for humans
   * @method updatedAtForHumans
   * @return [type]             [description]
   */
  public function getUpdatedAtForHumansAttribute()
  {
    try {
      if (is_object($this->updated_at)) {
        return $this->updated_at->diffForHumans();
      } elseif ( !empty($this->updated_at) ) {
        return Carbon::createFromFormat('Y-m-d G:i:s.000', $this->updated_at )->diffForHumans();

      }

      return null;

    }

    catch(Exception $e) {
      return null;
    }


  }

  /**
   * Get recent alerts from the last hour
   * @method scopeRecent
   * @param  [type]      $query [description]
   * @return [type]             [description]
   */
  public function scopeRecent($query)
  {
    return $query->where('created_at','>=', date('Y-m-d H:i:s', strtotime("1 hour ago")) );
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
  public function scopeUnacknowledged($query)
  {
    return $query->where('acknowledged_flag',0);
  }

}
