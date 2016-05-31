<?php

namespace App;

class ServerService extends Model
{   
    /**
     * The database table
     *
     * @var        string
     */
    protected $table = 'server_services';

    /**
     * The assignable fields
     *
     * @var        array
     */
    protected $fillable = [
        'name',
        'server_id',
        'status',
        'start_mode'
    ];

    /**
    * A service belongs to one server
    * @method server
    * @return [type] [description]
    */
    public function server()
    {
        return $this->belongsTo('App\Server');
    }

    /**
     * Get offline services
     */
    public function scopeOffline($query)
    {
        return $query->where('status','Stopped');
    }

    /**
     * Get automatic services
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeAutomatic($query)
    {
        return $query->where('start_mode','auto');
    }

}
