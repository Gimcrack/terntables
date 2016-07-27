<?php

namespace App;

class ServerAgent extends Model
{
    protected $fillable = [
        'server_id',
        'status',
        'version'
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


}
