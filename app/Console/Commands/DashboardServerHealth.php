<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Server;
use Carbon\Carbon;
use Logger;

class DashboardServerHealth extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:serverHealth';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Logs any servers that are late checking in - could be an indication that the server or the agent is offline.';

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
      Server::lateCheckingIn()
        ->get()
        ->reject( function( Server $server ) {
            $server->fresh(); // get a fresh copy from the db
            $diff = Carbon::now()->diffInMinutes( Carbon::parse($server->last_checkin) );
            return ($diff < 15);
        })
        ->each( function(Server $server) {
            $this->log($server);
        });
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

    /**
     * Gets the message.
     *
     * @param      \App\Server  $server  The server
     */
    private function getMessage(Server $server)
    {
        return sprintf("Last checkin at [%s on %s]. Server may be offline.", 
            Carbon::parse($server->last_checkin)->format('g:i A'),
            Carbon::parse($server->last_checkin)->format('Y-m-d')
        );
    }

    /**
     * Get the severity of the issue
     * @method getLevel
     *
     * @return   string
     */
    private function getLevel($last_checkin)
    {
        $diff = Carbon::now()->diffInMinutes( Carbon::parse($last_checkin) );

        switch($diff) {
            case $diff < 20 : return 'error';
            case $diff >= 20 && $diff < 40 : return 'critical';
            case $diff >= 40 && $diff < 60 : return 'alert';
            case $diff >= 60 : return 'emergency';
        }
    }

}
