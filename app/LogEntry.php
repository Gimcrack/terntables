<?php

namespace App;

class LogEntry extends Model
{	
	/**
	 * The table
	 *
	 * @var        string
	 */
    protected $table = 'log_entries';

    /**
     * The fillable fiels
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
    ];

    
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
	public function scopeAll($query)
	{
		return $query->whereRaw('1=1')->orderBy('created_at','DESC');
	}
}
