<?php

namespace App\Console\Commands;

use Logger;
use Carbon;
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