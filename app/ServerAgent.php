<?php

namespace App;

class ServerAgent extends Model
{
    protected $fillable = [
        'server_id',
        'status',
        'version'
    ];

    protected $searchableColumns = [
    'server.name' => 80,
    'status' => 50,
    'version' => 20,
    'server.status' => 10,
  ];

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


}
