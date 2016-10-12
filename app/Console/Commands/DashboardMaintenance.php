<?php

namespace App\Console\Commands;

use Log;
use Logger;
use App\Server;
use Carbon\Carbon;
use App\UpdateDetail;
use App\MaintenanceWindow;
use Illuminate\Console\Command;

class DashboardMaintenance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:maintenance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if there is a current maintenance window and perform maintenance';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
      MaintenanceWindow::current()
       ->get()
       ->reject( function (MaintenanceWindow $window) {
            return !! $window->inactive_flag;
       })
       ->each( function( MaintenanceWindow $window ) {
            $scope = $window->server_scope;

            if ( !! $window->approve_flag )
            {
                $this->approve($window);
            }

            if ( !! $window->install_flag )
            {
                $this->install($window);
            }

            if ( !! $window->reboot_flag )
            {
                $this->reboot($window);
            }

       });
    }

    /**
     * Description
     * @method getServers
     *
     * @return   void
     */
    private function getServers(MaintenanceWindow $window)
    {
        $scope = $window->server_scope;
        $group_id = $window->group_id;

        return Server::updatable()
            ->$scope()
            ->ofGroup($group_id);
    }

    /**
     * Approve the updates that match the MaintenanceWindow criteria. 
     * @method approve
     *
     * @return   void
     */
    private function approve(MaintenanceWindow $window)
    {
        $ids = $this->getServers($window)->pluck('id');

        Log::debug('Approving updates for servers');
        
        UpdateDetail::whereIn('server_id', $ids )
            ->unapproved()
            ->update([
                'approved_flag' => 1
            ]);
    }

    /**
     * Install the updates on the servers matching the window criteria.
     * @method install
     *
     * @return   void
     */
    private function install(MaintenanceWindow $window)
    {
        Log::debug('Installing updates for servers');
        $this->getServers($window)
            ->whereStatus('Idle')
            ->update(['status' => 'Ready For Updates']);
    }

    /**
     * Reboot the servers matching the window criteria.
     * @method reboot
     *
     * @return   void
     */
    private function reboot(MaintenanceWindow $window)
    {
        Log::debug('Rebooting servers');
        $this->getServers($window)
            ->whereStatus('Reboot Required')
            ->update(['status' => 'Ready For Reboot']);
    }

    /**
     * Log the error
     *
     * @param      \App\Server  $server  The server
     */
    private function log(Server $server)
    {
        $level = $this->getLevel( $server->last_checkin );

        Logger::$level( $this->getMessage($server) , 'App\Server', $server->id);
    }

    

}
