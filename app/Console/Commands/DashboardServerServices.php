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
    const PRODUCTION_LEVEL = 'warning';

    /**
     * The default log level for testing servers
     *
     * @var        string
     */
    const TESTING_LEVEL = 'notice';

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
    protected $description = 'Command description';

    /**
     * The services to ignore
     */
    protected $ignored = [
        
        '*' => [ // ignore all services on these servers
            'gis102agstst',
            'rmapptst'
        ],

        '.NET Framework' => [
            '*'
        ],

        'Remote Registry' => [
            '*'
        ],

        'Software Protection' => [
            '*'
        ],

        'Google Update' => [
            '*'
        ], 

        'Windows Licensing' => [
            '*'
        ],

        'MBAMService' => [
            '*'
        ],

        'Microsoft Exchange Server Extension for Windows Server Backup' => [
            '*'
        ],

    ];

    /**
     * Assign levels to specific services
     */
    protected $levels = [
        // SQL Server
        'SQL Server (MSSQLSERVER)' => 'error',
        'SQL Server (COMMVAULT)' => 'error',
        'SQL Server (SQLEXPRESS)' => 'error',
        'SQL Server (PRNX_SQLEXP)' => 'error',
        'SQL Server (ISUITE2)' => 'error',
        'SQL Server (SPSQL)' => 'error',
        'SQL Server Agent (COMMVAULT)' => 'error',
        'SQL Server Agent (MSSQLSERVER)' => 'error',
        'SQL Server Agent (SPSQL)' => 'error',
        'SQL Server Analysis Services (MSSQLSERVER)' => 'error',
        'SQL Server Analysis Services (POWERPIVOT)' => 'error',
        'SQL Server Analysis Services (SPSQL)' => 'error',
        'SQL Server Browser' => 'error',
        'SQL Server Integration Services 10.0' => 'error',
        'SQL Server Integration Services 11.0' => 'error',
        'SQL Server Reporting Services (MSSQLSERVER)' => 'error',
        'SQL Server Reporting Services (SPSQL)' => 'error',
        'SQL Server VSS Writer' => 'error',

        // New World ERP
        'New World File Storage Service' => 'error',
        'New World Logos Approval Service' => 'error',
        'New World Logos Auditing Service' => 'error',
        'New World Logos Caching' => 'error',
        'New World Logos Discovery Proxy' => 'error',
        'New World Logos NeoGov Applicant Import' => 'error',
        'New World Logos Notification Service' => 'error',
        'New World Logos PDF Conversion' => 'error',
        'New World Logos Revenue Collection' => 'error',
        'NWSAppService' => 'error',
        
    ];

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->ignored = collect($this->ignored);
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        ServerService::with(['server'])
            ->automatic()
            ->offline()
            ->get()
            ->reject( function($service) {
                return $this->ignore($service);
            })
            ->each( function($service) {
                return $this->log($service);
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
                ( $svc === "*" ) || ( strpos($service->name, $svc) !== false )
            ) && (
                // server can be ignored
                ( in_array("*", $servers) || in_array($service->server->name, $servers) )
            );
        })->count();
    }

    /**
     * Log the offline service
     *
     * @param      ServerService  $service  The service
     */
    private function log( ServerService $service )
    {
        $level = $this->getLevel($service);
        $message = $this->getMessage($service);

        Logger::$level( $message, 'App\Server', $service->server->id );
    }

    /**
     * Gets the message.
     *
     * @param      ServerService  $service  The service
     */
    private function getMessage( ServerService $service )
    {
        return "{$service->name} - Service offline";
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
