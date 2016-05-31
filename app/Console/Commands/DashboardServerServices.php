<?php

namespace App\Console\Commands;

use Illuminate\Support\Collection;
use Illuminate\Console\Command;
use App\ServerService;
use Logger;

class DashboardServerServices extends Command
{
    const PRODUCTION_LEVEL = 'warning';
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
                return $this->check($service);
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
     * Check the service
     *
     * @param      ServerService  $service  The service
     */
    private function check( ServerService $service )
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
        return "[{$service->server->name}] {$service->name} - Service offline";
    }

    /**
     * Get the level of the Log Entry
     *
     * @param      ServerService  $service  The service
     * @param      Bool $production_flag Production Server?
     */
    private function getLevel( ServerService $service )
    {
        if ( ! $service->server->production_flag ) return static::TESTING_LEVEL;

        if ( ! isset($this->levels[$service->name]) ) return static::PRODUCTION_LEVEL;

        if ( ! is_array( $this->levels[$service->name] ) ) return $this->levels[$service->name];

        if ( ! isset($this->levels[$service->name][$service->server->name]) ) return static::PRODUCTION_LEVEL;

        return $this->levels[$service->name][$service->server->name];
    }
}
