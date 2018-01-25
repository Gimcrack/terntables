<?php

namespace App;

class DatabaseAG extends Model
{
    protected $table = 'database_ags';

    protected $fillable = [
        'name',
        'group_id',
        'primary_replica',
        'recovery_health',
        'sync_health',
        'cluster_name',
        'listener_name',
        'listener_ip',
        'inactive_flag',
    ];


    /**
     * An availability group can have many members
     */
    public function members()
    {
        return $this->belongsToMany(DatabaseAGMember::class,'database_ag_id')
            ->withTimestamps()
            ->withPivot(['priamry_flag']);
    }

    /**
     * An instance is managed by one group
     * @method owner
     * @return [type] [description]
     */
    public function owner()
    {
        return $this->belongsTo('App\Group','group_id');
    }
}
