<?php

namespace App;

use Ingenious\Eloquence\Builder;

class DatabaseInstance extends Model
{
    protected $table = 'database_instances';

    protected $fillable = [
        'name',
        'server_id',
        'group_id',
        'sql_product',
        'sql_edition',
        'sql_version',
        'min_memory',
        'max_memory',
        'total_memory',
        'processors',
        'collation',
        'compress_backups_flag',
        'max_degree_of_parallelism',
        'cost_threshold_of_parallelism',
        'inactive_flag',
    ];

    protected $searchableColumns = [
        'server.name' => 80,
        'name' => 50,
        'owner.name' => 50,
        'sql_product' => 20,
        'sql_edition' => 20,
        'sql_version' => 20,
      ];

    protected $casts = [
        'min_memory' => 'int',
        'max_memory' => 'int',
        'total_memory' => 'int',
        'processors' => 'int',
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
        return $this->belongsTo(Group::class,'group_id');
    }

    /**
     * Get all active DatabaseInstance records
     * @method scopeAll
     *
     * @return   Builder
     */
    public function scopeAll(Builder $query)
    {
        return $query->whereHas('server', function(Builder $q) {
            return $q->whereInactiveFlag(0);
        });
    }   
}
