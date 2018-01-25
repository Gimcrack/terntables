<?php

namespace App\Console\Commands;

use Illuminate\Support\Collection;
use Illuminate\Console\Command;
use App\ServerService;
use Logger;

class DashboardServerServices extends Command
{
    /**
     * The default log level for production servers
     *
     * @var        string
     */
    const PRODUCTION_LEVEL = 'error';

    /**
     * The default log level for testing servers
     *
     * @var        string
     */
    const TESTING_LEVEL = 'warning';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:serverServices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check services to see if any are offline or have not checked in recently';

    /**
     * The services to ignore
     */
    protected $ignored;

    /**
     * Assign levels to specific services
     */
    protected $levels;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->ignored = collect( config('server_services.ignored') );
        $this->levels = config('server_services.levels');
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // handle offline services
        ServerService::with(['server','service'])
            ->automatic()
            ->offline()
            ->get()
            ->reject( function($service) {
                return $this->ignore($service);
            })
            ->each( function($service) {
                return $this->log($service);
            });

        // handle services that are late to checkin
        ServerService::with(['server','service'])
            ->late()
            ->get()
            ->reject( function($service) {
                return $this->ignore($service);
            })
            ->each( function($service) {
                return $this->log($service, "Service Late Checking In");
            });
    }

    /**
     * Should the service be ignored?
     *
     * @param      ServerService  $service  The service
     */
    private function ignore( ServerService $service )
    {   
        if ( ! $service->server ) return true;
        if ( !! $service->server->inactive_flag ) return true;

        return !! $this->ignored->filter( function($servers, $svc) use ($service) {
            return ( 
                // service can be ignored
                ( $svc === "*" ) || ( stripos($service->name, $svc) !== false )
            ) && (
                // server can be ignored
                ( in_array("*", $servers) || in_array( strtolower($service->server->name), $servers) )
            );
        })->count();
    }

    /**
     * Log the service error.
     *
     * @param      ServerService  $service  The service
     */
    private function log( ServerService $service, $message = null )
    {
        $level = $this->getLevel($service);
        $message = $this->getMessage($service, $message);

        Logger::$level( $message, 'App\ServerService', $service->id );
    }

    /**
     * Gets the message.
     *
     * @param      ServerService  $service  The service
     */
    private function getMessage( ServerService $service, $message = null )
    {
        return sprintf("%s On [%s] - %s",
            $message ?: "Service Offline",
            $service->server->name,
            $service->name
        );
    }

    /**
     * Get the level of the Log Entry
     *
     * @param      ServerService  $service  The service
     * @param      Bool $production_flag Production Server?
     */
    private function getLevel( ServerService $service )
    {
        switch( true )
        {   
            case ( ! $service->isProduction() ) :
                // The server is not a production server
                //  return the default testing level
                return static::TESTING_LEVEL;

            case ( ! $this->doesTheServiceHaveACustomLevel( $service ) ) :
                // The service does not have custom level(s)
                //  return the default production level
                return static::PRODUCTION_LEVEL;

            case ( ! $this->doesTheServiceHaveCustomLevels( $service )  ) :
                // The service does not have custom levels per server
                //  return the default custom level for the service
                return $this->levels[$service->name]; 

            case ( ! $this->doesTheServiceServerHaveACustomLevel( $service ) ) :
                // The service does have custom levels per server, but not
                //  for the specified server.
                //  return the default production level
                return static::PRODUCTION_LEVEL;
        }

        // The service has a custom level for the specified server
        return $this->levels[$service->name][$service->server->name];

    }

    /**
     * Determines if custom level.
     *
     * @param      \App\ServerService  $service  The service
     * 
     * @return     bool
     */
    private function doesTheServiceHaveACustomLevel( ServerService $service )
    {
        return isset( $this->levels[ $service->name ] );
    }

    /**
     * Do Servers have custom levels for the specified service.
     *
     * @param      \App\ServerService  $service  The service
     * 
     * @return     bool 
     */
    private function doesTheServiceHaveCustomLevels( ServerService $service )
    {
        return is_array( $this->levels[ $service->name ] );
    }

    /**
     * Does the service have a custom level for the specified server
     *
     * @param      \App\ServerService  $service  The service
     */
    private function doesTheServiceServerHaveACustomLevel( ServerService $service)
    {
        return isset($this->levels[$service->name][$service->server->name]);
    }

}
