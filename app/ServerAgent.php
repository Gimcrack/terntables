<?php

namespace App;

use Carbon;

class ServerAgent extends Model
{

    protected $fillable = [
        'server_id',
        'status',
        'version'
    ];

    protected $appends = [
        'identifiable_name',
        'updated_at_for_humans',
        'name'
    ];

    protected $searchableColumns = [
        'server.name' => 80,
        'status' => 50,
        'version' => 20,
        'server.status' => 10,
    ];

    public function getNameAttribute()
    {
        if ( $this->server == null ) return '';
        return $this->server->name;
    }

    /**
     * A ServerAgent belongs to one Server
     * @method server
     *
     * @return   void
     */
    public function server()
    {
        return $this->belongsTo(Server::class);
    }

    /**
     * Get the outdated agents.
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeOutdated($query)
    {
        return $query->where('version','<',static::all()->lists('version')->max());
    }

    /**
     * Get server agents which are late checking in
     * @method scopeLateCheckingIn
     * @param  [type]              $query [description]
     * @return [type]                     [description]
     */
    public function scopeLateCheckingIn($query)
    {
        return $query
        ->whereHas('server', function($q) {
            return $q->where('inactive_flag',0);
        })
        ->where('updated_at','<', Carbon::now()->subMinutes(5) );
    }


}
