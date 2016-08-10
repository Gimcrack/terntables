<?php

namespace App\Console\Commands;

use Carbon;
use Logger;
use App\Server;
use App\ServerDisk;
use Illuminate\Console\Command;


class DashboardServerDiskHealth extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:serverDiskHealth';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Logs any disks that are late checking in - could be an indication that the disk is offline.';

    /**
     * Ignore these servers when doing checks.
     * @var [type]
     */
    protected $ignored = [
      'DSJCOMM1' => '*',
      'DSJ-VSA' => '*'
    ];

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
        ServerDisk::lateCheckingIn()
            ->get()
            ->reject( function($disk) {
                return $this->ignore($disk);
            })
            ->each( function(ServerDisk $disk){
                $this->log($disk);
            });
    }

    /**
     * Log the error
     *
     * @param      \App\ServerDisk  $disk  The ServerDisk
     */
    private function log(ServerDisk $disk)
    {
        Logger::error( $this->getMessage($disk) , 'App\ServerDisk', $disk->id);
    }

    /**
     * Should the disk be ignored?
     *
     * @param      ServerDisk  $disk   The disk
     */
    private function ignore( ServerDisk $disk )
    {
        return ( !! $disk->inactive_flag || ! $disk->server || !! $disk->server->inactive_flag || $this->isIgnored($disk) );
    }

    /**
     * Determines if ignored server.
     *
     * @param      ServerDisk  $disk  The disk
     */
    private function isIgnored( ServerDisk $disk )
    {
        $server = strtoupper($disk->server->name);
        return in_array($server, $this->ignored) || in_array($server, array_keys($this->ignored));
    }

    /**
     * Gets the message.
     *
     * @param      \App\ServerDisk  $disk  The ServerDisk
     */
    private function getMessage(ServerDisk $disk)
    {
        return sprintf("Possible Offline Disk on [%s]: Last checkin: %s", 
            ( $disk->server != null ) ? $disk->server->name : '',
            (new Carbon($disk->updated_at))->diffForHumans() 
        );
    }
}
