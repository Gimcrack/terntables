<?php

namespace App;

use App\Model;

class OutageTaskDetail extends Model
{
  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'outage_task_details';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'name',
    'description',
    'task_type',
    'group_id',
    'person_id',
    'outage_task_id',
    'outage_id',
    'server_id',
    'application_id',
    'database_id',
    'status',
    'notes'
  ];

  protected $searchableColumns = [
    'name' => 80,
    'status' => 30,
    'description' => 30,
    'task_type' => 30,
    'owner.name' => 30,
    'assignee.name' => 40,
    'server.name' => 50,
    'server.status' => 50,
    'application.name' => 50,
    'database.name' => 50
  ];

  /**
   * Set the group_id attribute
   * @method setGroupIdAttribute
   * @param  [type]              $value [description]
   */
  public function setGroupIdAttribute($value)
  {
      $this->attributes['group_id'] = $value ?: null;
  }

  /**
   * Set the database_id attribute
   * @method setDatabaseIdAttribute
   * @param  [type]              $value [description]
   */
  public function setDatabaseIdAttribute($value)
  {
      $this->attributes['database_id'] = $value ?: null;
  }

  /**
   * Set the application_id attribute
   * @method setApplicationIdAttribute
   * @param  [type]              $value [description]
   */
  public function setApplicationIdAttribute($value)
  {
      $this->attributes['application_id'] = $value ?: null;
  }

  /**
   * Set the server_id attribute
   * @method setServerIdAttribute
   * @param  [type]              $value [description]
   */
  public function setServerIdAttribute($value)
  {
      $this->attributes['server_id'] = $value ?: null;
  }

  /**
   * Set the outage_id attribute
   * @method setOutageIdAttribute
   * @param  [type]              $value [description]
   */
  public function setOutageIdAttribute($value)
  {
      $this->attributes['outage_id'] = $value ?: null;
  }

  /**
   * Set the person_id attribute
   * @method setPersonIdAttribute
   * @param  [type]              $value [description]
   */
  public function setPersonIdAttribute($value)
  {
    $this->attributes['person_id'] = $value ?: null;
  }

  /**
   * Set the outage_task_id attribute
   * @method setOutageTaskIdAttribute
   * @param  [type]              $value [description]
   */
  public function setOutageTaskIdAttribute($value)
  {
      $this->attributes['outage_task_id'] = $value ?: null;
  }

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
   * An Outage Task is assigned to one Person
   * @method owner
   * @return [type] [description]
   */
  public function assignee()
  {
    return $this->belongsTo('App\Person','person_id');
  }

  /**
   * An Outage Task Detail may belong to one outage task
   * @method outage_task
   * @return [type]      [description]
   */
  public function outage_task()
  {
    return $this->belongsTo('App\OutageTask','outage_task_id');
  }

  /**
   * An Outage Task is assigned to one Outage
   * @method owner
   * @return [type] [description]
   */
  public function outage()
  {
    return $this->belongsTo('App\Outage');
  }

  /**
   * An Outage Task may be assigned to one server
   * @method servers
   * @return [type]  [description]
   */
  public function server()
  {
    return $this->belongsTo('App\Server');
  }

  /**
   * An Outage Task may apply to one application
   * @method applications
   * @return [type]  [description]
   */
  public function application()
  {
    return $this->belongsTo('App\Application');
  }

  /**
   * An Outage Task may apply to one database
   * @method applications
   * @return [type]  [description]
   */
  public function database()
  {
    return $this->belongsTo('App\Database');
  }

}
