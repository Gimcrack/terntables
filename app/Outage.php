<?php

namespace App;

use App\Model;
use App\OutageTask;
use App\OutageTaskDetail;
use App\Events\OutageWasModified;
use Event;
use Log;

class Outage extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'outages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      'outage_date',
      'complete_flag'
    ];

    /**
     * The column that identifies the model
     * @return [type] [description]
     */
    public function identifiableName()
    {
        return $this->outage_date;
    }

    protected $searchableColumns = [
      'outage_date' => 80,
    ];

    /**
     * Get pending outages (i.e. not complete)
     * @method scopePending
     * @param  [type]       $query [description]
     * @return [type]              [description]
     */
    public function scopePending($query)
    {
      return $query->where('complete_flag',0);
    }

    /**
     * Get pending outage from today
     * @method scopeActive
     * @param  [type]      $query [description]
     * @return [type]             [description]
     */
    public function scopeActive($query)
    {
      return $query->pending()->where('outage_date', date('Y-m-d'));
    }

    /**
     * An Outage may have many Outage Tasks
     * @method OutageTasks
     */
    public function tasks()
    {
      return $this->belongsToMany('App\OutageTask')->withTimestamps();
    }

    /**
     * An Outage may have many Outage Task Details through Outage Tasks
     * @method outageTaskDetails
     * @return [type]            [description]
     */
    public function details()
    {
      return $this->hasMany('App\OutageTaskDetail');
    }

    /**
     * Clear any task details that have been assigned to this task
     * @method clearTaskDetails
     * @return [type]           [description]
     */
    public function resetTaskDetails()
    {
      OutageTaskDetail::where('outage_id',$this->id)
        ->whereNull('person_id')
        ->where('status','New')
        ->delete();
    }

    /**
     * Generate all the task details for pending outages.
     * @method generateAllTaskDetails
     * @return [type]                 [description]
     */
    public static function generateAllTaskDetails()
    {
      Outage::pending()->get()->each( function($outage) {
        $outage->generateTaskDetails();
      });
    }

    /**
     * Generate Task Details
     * @method generateTaskDetails
     * @return [type]              [description]
     */
    public function generateTaskDetails()
    {
      Log::info('Resetting the task details');
      $this->resetTaskDetails();

      // get the tasks for the outage
      $tasks = $this->tasks;

      if ( ! $tasks->count() ) return false;

      $tasks->each( function($task) {
        Log::info("Generating task details for {$task->name} on {$this->outage_date}");
        $task->generateOutageTaskDetails($this);
      });

    }

}
