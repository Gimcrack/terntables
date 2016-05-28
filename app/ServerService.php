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
        return $query->where('status','offline');
    }

}
