<?php

namespace App;

class ServerService extends Model
{   
    /**
     * The database table
     *
     * @var        string
     */
    protected $table = 'server_service';

    /**
     * The assignable fields
     *
     * @var        array
     */
    protected $fillable = [
        'service_id',
        'server_id',
        'status',
        'start_mode'
    ];

    /**
     * Gets the name attribute.
     */
    public function getNameAttribute()
    {
        return $this->service->name;
    }

    /**
     * Creates a ServerService record or updates an existing record.
     */
    public function createOrUpdate( $atts )
    {   
        if ( ! isset($atts['server_id']) || 
             ! isset($atts['service_id']) ) return false;

        if ( !! $svc = static::where( 'server_id', $atts['server_id'] )
                        ->where('service_id', $atts['service_id']->first() ) )
        {
            return $svc->update($atts);
        }
        else
        {
            return static::create($atts);
        }
    }

    /**
     * Determines if production.
     *
     * @return     boolean  True if production, False otherwise.
     */
    public function isProduction()
    {
        return !! $this->server->production_flag;
    }

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
     * A ServerService belongs to one service
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function service()
    {
        return $this->belongsTo('App\Service');
    }

    /**
     * Get services for active servers
     */
    public function scopeActive($query)
    {
        return $query->whereHas('server', function($q) {
                $q->where('inactive_flag',0);
            });
    }

    /**
     * Get offline services
     */
    public function scopeOffline($query)
    {
        return $query
            ->active()
            ->where('status','Stopped');
    }

    /**
     * Get services late to checkin
     */
    public function scopeLate($query)
    {
        return $query
            ->active()
            ->where('updated_at','<', date('Y-m-d', strtotime("-20 minutes")) );
    }

    /**
     * Get automatic services
     *
     * @param      <type>  $query  The query
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public function scopeAutomatic($query)
    {
        return $query->where('start_mode','auto');
    }

}
