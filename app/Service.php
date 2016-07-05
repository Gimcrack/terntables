<?php

namespace App;

class Service extends Model
{
    /**
     * The database table
     *
     * @var        string
     */
    protected $table = 'services';

    /**
     * The assignable fields
     *
     * @var        array
     */
    protected $fillable = [
        'name',
        'level'
    ];

    /**
     * Set up a new model
     */
    public function __construct()
    {
        array_push($this->appends, 'count');

        parent::__construct();
    }

    /**
     * A service can have many servers
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function servers()
    {
        return $this->belongsToMany('App\Server')->withTimestamps()->withPivot(['status','start_mode','level']);
    }

    /**
     * Gets the count attribute.
     *
     * @return     <type>  The count attribute.
     */
    public function getCountAttribute()
    {
        return $this->servers->count();
    }

}
