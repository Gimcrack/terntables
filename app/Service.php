<?php

namespace App;

class Service extends Model
{
    /**
     * The assignable fields
     *
     * @var        array
     */
    protected $fillable = [
        'name',
        'level'
    ];

    protected $appends = [
        'identifiable_name',
        'updated_at_for_humans',
        //'count'
    ];

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
