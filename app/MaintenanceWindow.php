<?php

namespace App;

use Carbon;
use Illuminate\Database\Eloquent\Builder;

class MaintenanceWindow extends Model
{
    protected $fillable = [
        'start_at',
        'end_at',
        'group_id',
        'server_scope',
        'approve_flag',
        'install_flag',
        'reboot_flag',
        'inactive_flag',
    ];

    /**
     * A MaintenanceWindow applies to one Group
     * @method group
     *
     * @return   BelongsTo
     */
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get all active MaintenanceWindows
     * @method scopeActive
     *
     * @return   void
     */
    public function scopeActive(Builder $query)
    {
        return $query->where('end_at','>=',Carbon::now()->format('Y-m-d H:i:s'));
    }

    /**
     * Get all current MaintenanceWindows
     * @method scopeCurrent
     *
     * @return   void
     */
    public function scopeCurrent(Builder $query)
    {
        return $query->where('end_at','>=',Carbon::now()->format('Y-m-d H:i:s'))
                    ->where('start_at','<',Carbon::now()->format('Y-m-d H:i:s'));
    }


}
