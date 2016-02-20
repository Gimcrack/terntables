<?php

namespace App;

use App\Model;
use App\Outage;
use App\OutageTaskDetail;
use Log;

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
    'task_type',
    'scope_to_production_servers',
    'criteria_selection'
  ];

  // /**
  //  * Save the model
  //  * @method save
  //  * @return [type] [description]
  //  */
  // public function save(array $options = [])
  // {
  //   parent::save($options);
  //
  //   //Outage::generateAllTaskDetails();
  // }

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
  public function scope_to_outages()
  {
    return $this->belongsToMany('App\Outage')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many servers
   * @method servers
   * @return [type]  [description]
   */
  public function scope_to_servers()
  {
    return $this->belongsToMany('App\Server')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many applications
   * @method applications
   * @return [type]  [description]
   */
  public function scope_to_applications()
  {
    return $this->belongsToMany('App\Application')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many databases
   * @method applications
   * @return [type]  [description]
   */
  public function scope_to_databases()
  {
    return $this->belongsToMany('App\Database')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many groups
   * @method applications
   * @return [type]  [description]
   */
  public function assign_to_groups()
  {
    return $this->belongsToMany('App\Group')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many people
   * @method applications
   * @return [type]  [description]
   */
  public function assign_to_people()
  {
    return $this->belongsToMany('App\Person')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many operating systems
   * @method applications
   * @return [type]  [description]
   */
  public function scope_to_operating_systems()
  {
    return $this->belongsToMany('App\OperatingSystem')->withTimestamps();
  }

  /**
   * An Outage Task may apply to many groups
   * @method applications
   * @return [type]  [description]
   */
  public function scope_to_groups()
  {
    return $this->belongsToMany('App\Group','group_outage_task_objects','outage_task_id','group_id')->withTimestamps();
  }

  /**
   * Generate outage task details
   * @method generateOutageTaskDetails
   * @param  [type]                    $outage [description]
   * @return [type]                            [description]
   */
  public function generateOutageTaskDetails(Outage $outage)
  {
    if ( !! $this->inactive_flag ) {
      Log::info( "The task '{$this->name}' is inactive, aborting task detail generation" );
      return false;
    }

    if ( !! $this->scope_to_groups->count() )
    {
      Log::info( "..Scoping the task {$this->name} to group objects" );
      return $this->generateOutageTaskDetailsScopedToGroups($outage);
    }


    $this->generateOutageTaskDetailsScopedToServers($outage);

    $this->generateOutageTaskDetailsScopedToApplications($outage);

    $this->generateOutageTaskDetailsScopedToDatabases($outage);

  }

  /**
   * Generate Outage Task Details scoped to Groups
   * @method generateOutageTaskDetailsScopedToGroups
   * @param  Outage                                  $outage [description]
   * @return [type]                                          [description]
   */
  private function generateOutageTaskDetailsScopedToGroups(Outage $outage)
  {
    $groups = $this->scope_to_groups->lists('id');

    switch( $this->task_type ) {
      case 'Server Task' :
        $servers = \App\Server::active()
                    ->whereIn('group_id',$groups);

        if ( !! $this->scope_to_operating_systems->count() )
        {
          $oses = $this->scope_to_operating_systems->lists('id');
          $servers = $servers->whereIn('operating_system_id',$oses);
        }

        if ( $this->scope_to_production_servers == 1 )
        {
          $servers = $servers->production();
        }

        elseif ( $this->scope_to_production_servers == 2 )
        {
          $servers = $servers->nonproduction();
        }

        $servers = $servers->get();

        return $this->generateOutageTaskDetailsScopedToServers($outage, $servers);

      case 'Application Task' :
        $applications = \App\Application::active()
                          ->whereIn('group_id',$groups)
                          ->get();
        return $this->generateOutageTaskDetailsScopedToApplications($outage, $applications);

      case 'Database Task' :
        $databases = \App\Database::active()
                        ->whereIn('group_id',$groups)
                        ->get();

        if ( $this->scope_to_production_servers == 1 )
        {
          $databases = $databases->production();
        }

        elseif ( $this->scope_to_production_servers == 2 )
        {
          $databases = $databases->nonproduction();
        }

        return $this->generateOutageTaskDetailsScopedToDatabases($outage, $databases);
    }
  }

  /**
   * Generate Outage Task Details scoped to Servers
   * @method generateOutageTaskDetailsScopedToServers
   * @param  Outage                                  $outage [description]
   * @return [type]                                          [description]
   */
  private function generateOutageTaskDetailsScopedToServers(Outage $outage, $servers = null)
  {
    $servers = $servers ?: $this->scope_to_servers;
    if (empty($servers)) return false;

    $task_details = $this->getOutageTaskDetailBaseAttributes($outage);

    $servers->each( function($server) use ($task_details) {
      Log::info( "..Creating the task {$this->name} for server {$server->name}" );
      $task_details['server_id'] = $server->id;
      $this->generateOutageTaskDetail($task_details);
    });
  }

  /**
   * Generate Outage Task Details scoped to Applications
   * @method generateOutageTaskDetailsScopedToApplications
   * @param  Outage                                  $outage [description]
   * @return [type]                                          [description]
   */
  private function generateOutageTaskDetailsScopedToApplications(Outage $outage, $applications = null)
  {
    $applications = $applications ?: $this->scope_to_applications;
    if (empty($applications)) return false;

    $task_details = $this->getOutageTaskDetailBaseAttributes($outage);

    foreach($applications as $application)
    {
      Log::info( "..Creating the task {$this->name} for application {$application->name}" );
      $task_details['application_id'] = $application->id;
      $this->generateOutageTaskDetail($task_details);
    }
  }

  /**
   * Generate Outage Task Details scoped to Databases
   * @method generateOutageTaskDetailsScopedToDatabases
   * @param  Outage                                  $outage [description]
   * @return [type]                                          [description]
   */
  private function generateOutageTaskDetailsScopedToDatabases(Outage $outage, $databases = null)
  {
    $databases = $databases ?: $this->scope_to_databases;
    if (empty($databases)) return false;

    $task_details = $this->getOutageTaskDetailBaseAttributes($outage);

    foreach($databases as $database)
    {
      Log::info( "..Creating the task {$this->name} for database {$database->name}" );
      $task_details['database_id'] = $database->id;
      $this->generateOutageTaskDetail($task_details);
    }
  }

  /**
   * Get the base attributes of the Outage Task Detail
   * @method getOutageTaskDetailBaseAttributes
   * @param  Outage                            $outage [description]
   * @return [type]                                    [description]
   */
  private function getOutageTaskDetailBaseAttributes(Outage $outage)
  {
    return [
      'name' => $this->name,
      'description' => $this->description,
      'task_type' => $this->task_type,
      'group_id' => $this->group_id,
      'outage_task_id' => $this->id,
      'outage_id' => $outage->id,
      'status' => 'New'
    ];
  }


  /**
   * Generate Outage Task From specified details
   * @method generateOutageTask
   * @param  [type]             $task_details [description]
   * @return [type]                           [description]
   */
  private function generateOutageTaskDetail($task_details)
  {
    if ( $this->doesTheTaskDetailExist($task_details) )
    {
      return false;
    }
    return OutageTaskDetail::create($task_details);
  }

  /**
   * Check to see if a task detail has been generated already
   * @method doesTheTaskDetailExist
   * @param  [type]                  $task_details [description]
   * @return [type]                                [description]
   */
  private function doesTheTaskDetailExist($task_details)
  {
    $warning = "Task task with name {$task_details['name']} already exists for outage with id {$task_details['outage_id']} ";

    $query = OutageTaskDetail::where('outage_id',$task_details['outage_id'])
            ->where('outage_task_id',$task_details['outage_task_id']);

    switch( $task_details['task_type'] )
    {
      case 'Server Task' :
        $query = $query->where('server_id',$task_details['server_id']);
        $warning .= "for server {$task_details['server_id']}";
      break;

      case 'Application Task' :
        $query = $query->where('application_id',$task_details['application_id']);
        $warning .= "for application {$task_details['application_id']}";
      break;

      case 'Database Task' :
        $query = $query->where('database_id',$task_details['database_id']);
        $warning .= "for database {$task_details['database_id']}";
      break;
    }

    if ( !! $query->count() )
    {
      Log::warning($warning);
      return true;
    }

    return false;
  }



}
