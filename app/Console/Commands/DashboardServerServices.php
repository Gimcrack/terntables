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
                ( $svc === "*" ) || ( strpos($service->name, $svc) !== false )
            ) && (
                // server can be ignored
                ( in_array("*", $servers) || in_array($service->server->name, $servers) )
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

        'Windows Update' => [
            '*'
        ], 

        'Shell Hardware Detection' => [
            '*'
        ], 

        'NWS Logos Automated Import' => [
            '*'
        ],

        'Virtual Disk' => [
            '*'
        ],

        'MBAMService' => [
            '*'
        ],

        'Microsoft Exchange Server Extension for Windows Server Backup' => [
            '*'
        ],

        'HP Records Manager Render Service' => [
            '*'
        ],

        'Web Management Service' => [
            'actions2'
        ],
    ];


    /**
     * Assign levels to specific services
     */
    protected $levels = [
        // SQL Server
        'SQL Server (MSSQLSERVER)' => 'alert',
        'SQL Server (COMMVAULT)' => 'alert',
        'SQL Server (SQLEXPRESS)' => 'alert',
        'SQL Server (PRNX_SQLEXP)' => 'alert',
        'SQL Server (ISUITE2)' => 'alert',
        'SQL Server (SPSQL)' => 'alert',
        'SQL Server Agent (COMMVAULT)' => 'alert',
        'SQL Server Agent (MSSQLSERVER)' => 'alert',
        'SQL Server Agent (SPSQL)' => 'alert',
        'SQL Server Analysis Services (MSSQLSERVER)' => 'alert',
        'SQL Server Analysis Services (POWERPIVOT)' => 'alert',
        'SQL Server Analysis Services (SPSQL)' => 'alert',
        'SQL Server Browser' => 'alert',
        'SQL Server Integration Services 10.0' => 'alert',
        'SQL Server Integration Services 11.0' => 'alert',
        'SQL Server Reporting Services (MSSQLSERVER)' => 'alert',
        'SQL Server Reporting Services (SPSQL)' => 'alert',
        'SQL Server VSS Writer' => 'alert',

        // New World ERP
        'New World File Storage Service' => 'alert',
        'New World Logos Approval Service' => 'alert',
        'New World Logos Auditing Service' => 'alert',
        'New World Logos Caching' => 'alert',
        'New World Logos Discovery Proxy' => 'alert',
        'New World Logos NeoGov Applicant Import' => 'alert',
        'New World Logos Notification Service' => 'alert',
        'New World Logos PDF Conversion' => 'alert',
        'New World Logos Revenue Collection' => 'alert',
        'NWSAppService' => 'alert',

        // Other
        'MSB Windows Update Management' => 'alert'    
    ];
}
