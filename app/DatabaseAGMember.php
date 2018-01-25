<?php

namespace App;

class DatabaseAGMember extends Model
{
    protected $table = 'database_ag_members';

    protected $fillable = [
        'database_ag_id',
        'server_id',
        'primary_flag'
    ];  

    /**
     * A dag member has one dag
     * @method database_ag
     *
     * @return   Relationship
     */
    public function database_ag()
    {
        return $this->belongsTo(DatabaseAG::class);
    }

    /**
     * A dag member has one server
     * @method server
     *
     * @return   Relationship
     */
    public function server()
    {
        return $this->belongsTo(Server::class);
    }
}