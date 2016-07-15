<?php

namespace App;

class DatabaseInstance extends Model
{
    protected $table = 'database_instances';

    protected $fillable = [
        'name',
        'server_id',
        'group_id',
        'sql_product',
        'sql_version',
        'total_memory',
        'processors',
        'root_directory',
        'server_collation',
        'min_memory',
        'max_memory',
        'compress_backups_flag',
        'max_degree_of_parallelism',
        'cost_threshold_of_parallelism',
        'aoag_member_flag',
        'aoag_role',
        'aoag_wsfc_name',
        'aoag_listener_name',
        'aoag_listener_ips',
        'inactive_flag',
        'production_flag',
    ];

    /**
     * An instance has one server
     */
    public function server()
    {
        return $this->belongsTo(Server::class);
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
