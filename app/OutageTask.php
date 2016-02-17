<?php

namespace App;

use App\Model;

class OutageTask extends Model
{
  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'outage_tasks';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'name',
    'description',
    'inactive_flag',
    'group_id',
    'task_type'
  ];

  /**
   * An Outage Task belongs to one Group
   * @method owner
   * @return [type] [description]
   */
  public function owner()
  {
    return $this->belongsTo('App\Group','group_id');
  }

  /**
   * An Outage Task may be assigned to many Outages
   * @method Outages
   */
  public function outages()
  {
    return $this->belongsToMany('App\Outage')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many servers
   * @method servers
   * @return [type]  [description]
   */
  public function servers()
  {
    return $this->belongsToMany('App\Server')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many applications
   * @method applications
   * @return [type]  [description]
   */
  public function applications()
  {
    return $this->belongsToMany('App\Application')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many databases
   * @method applications
   * @return [type]  [description]
   */
  public function databases()
  {
    return $this->belongsToMany('App\Database')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many groups
   * @method applications
   * @return [type]  [description]
   */
  public function groups()
  {
    return $this->belongsToMany('App\Group')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many people
   * @method applications
   * @return [type]  [description]
   */
  public function people()
  {
    return $this->belongsToMany('App\Person')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many operating systems
   * @method applications
   * @return [type]  [description]
   */
  public function operatingSystems()
  {
    return $this->belongsToMany('App\OperatingSystem')->withTimestamps();
  }

}
