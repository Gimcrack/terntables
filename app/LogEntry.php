<?php

namespace App;

use Carbon;
use Ingenious\Eloquence\Builder;

class LogEntry extends Model
{	
	/**
	 * The table
	 *
	 * @var        string
	 */
    protected $table = 'log_entries';

    /**
     * The fillable fields
     *
     * @var        array
     */
    protected $fillable = [
    	'user_id',
    	'message',
    	'context',
    	'level',
    	'level_name',
    	'channel',
    	'extra',
    	'reported_at',
    	'loggable_id',
    	'loggable_type',
        'notified_at',
    ];

    protected $searchableColumns = [
        'message',
        'loggable_type',
    ];

    public function getLoggableNameAttribute()
    {
        return ( !! $this->loggable ) ? $this->loggable->identifiable_name() : '';
    }

    public function getMessageAttribute($message)
    {
        return substr($message, 0, 250);
    }

    /**
     * Polymorphic relationship
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function loggable()
    {
    	return $this->morphTo();
    }

    /**
	* Scope All
	* @method scopeAll
	* @return [type]   [description]
	*/
	public function scopeAll( Builder $query )
	{
		return $query->where('channel','dashboard');
	}

    /**
     * Order By Level
     * @method scopeByLevel
     *
     * @return   void
     */
    public function scopeByLevel(Builder $query )
    {
        return $query->orderBy('level','DESC');
    }

    /**
    * Scope Dashboard
    * @method scopeDashboard
    * @return [type]   [description]
    */
    public function scopeDashboard(Builder $query )
    {
        return $query->where('channel','production');
    }
 
    /**
     * Get the recently reported events
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeRecent( Builder $query )
    {
        return $query->where('reported_at','>',date('Y-m-d H:i:s', strtotime("-48 hours")));
    }

    /**
     * Get notifications that are not about the dashboard
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeNotDashboard( Builder $query )
    {
        return $query
            ->where('loggable_type','<>','App\Application')
            ->where('loggable_id','<>',9);
    }

    /**
     * Get important log entries
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeImportant( Builder $query )
    {
        return $query->notDashboard()->where('level','>',300);
    }

    /**
     * Get unimportant log entries
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeWeekly( Builder $query )
    {
        return $query
            ->notDashboard()
            ->whereIn('level_name',['INFO','DEBUG']);
    }

    /**
     * Get daily log entries
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeDaily( Builder $query )
    {
        return $query
            ->notDashboard()
            ->whereIn('level_name',['WARNING','NOTICE']);
    } 

    /**
     * Get every 15 minutes log entries
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeFifteen( Builder $query )
    {
        return $query
            ->notDashboard()
            ->whereIn('level_name',['ERROR','CRITICAL']);
    } 

    /**
     * Get unnotified log entries
     *
     * @param      <type>  $query  The query
     */
    public function scopeUnnotified( Builder $query )
    {
        return $query->whereNull('notified_at');
    }

    /**
     * A notification was sent for this Log Entry
     */
    public function didNotify()
    {
        $this->update(['notified_at' => Carbon::now()]);
    }

    /**
     * Is the logEntry Silenced?
     * @method isSilenced
     *
     * @return   void
     */
    public function isSilenced()
    {
        return !! SilencedNotification::where('loggable_id',$this->loggable_id)
            ->where('loggable_type',$this->loggable_type)
            ->active()
            ->count();
    }
}
