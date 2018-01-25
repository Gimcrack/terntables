<?php

namespace App;

use Carbon;
use Ingenious\Eloquence\Builder;

class SilencedNotification extends Model
{
    protected $appends = [
        'expires_at_for_humans',
        'server',
        'expired_flag'
    ];

    /**
     * The fillable fields
     *
     * @var        array
     */
    protected $fillable = [
        'loggable_id',
        'loggable_type',
        'expires_at',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'expires_at'
    ];

    /**
     * Gets the server attribute.
     */
    public function getServerAttribute()
    {

        if ( $this->loggable_type == 'App\Server' )
        {
            return $this->loggable;
        }

        if ( !! $this->loggable && !! $this->loggable->server )
        {
            return $this->loggable->server;
        }

        return null;
    }

    /**
     * Gets the expired flag attribute.
     */
    public function getExpiredFlagAttribute()
    {
        return Carbon::createFromFormat('Y-m-d G:i:s.000',(string) $this->attributes['expires_at'])->copy()->isPast();
    }

    /**
     * Gets the expires at for humans attribute.
     *
     * @return     <type>  The expires at for humans attribute.
     */
    public function getExpiresAtForHumansAttribute()
    {
        return Carbon::createFromFormat('Y-m-d G:i:s.000',(string) $this->attributes['expires_at'])->copy()->diffForHumans();
    }

    /**
     * Polymorphic relationship
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function loggable()
    {
        return $this->morphTo();
    }

    /**
     * Get the active records
     * @method scopeActive
     *
     * @return   void
     */
    public function scopeActive( Builder $query )
    {
        return $query->where('expires_at','>',Carbon::now());
    }
}
