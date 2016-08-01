<?php

namespace App;

use Carbon;

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
	public function scopeAll( $query )
	{
		return $query->latest();
	}
 
    /**
     * Get the recently reported events
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeRecent($query)
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
    public function scopeNotDashboard($query)
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
    public function scopeImportant($query)
    {
        return $query->where('level','>',300)->latest();
    }

    /**
     * Get unimportant log entries
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeWeekly( $query )
    {
        return $query
            ->notDashboard()
            ->whereIn('level_name',['INFO','DEBUG'])
            ->orderBy('level','DESC');
    }

    /**
     * Get daily log entries
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeDaily( $query )
    {
        return $query
            ->notDashboard()
            ->whereIn('level_name',['WARNING','NOTICE'])
            ->orderBy('level','DESC'); 
    } 

    /**
     * Get every 15 minutes log entries
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeFifteen( $query )
    {
        return $query
            ->notDashboard()
            ->whereIn('level_name',['ERROR','CRITICAL'])
            ->orderBy('level','DESC'); 
    } 

    /**
     * Get unnotified log entries
     *
     * @param      <type>  $query  The query
     */
    public function scopeUnnotified($query)
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
