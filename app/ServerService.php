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
     * Get offline services
     */
    public function scopeOffline($query)
    {
        return $query->where('status','Stopped');
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
