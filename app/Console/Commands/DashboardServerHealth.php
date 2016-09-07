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
        ->each( function(Server $server)
          {
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
        $severity = $this->getSeverity( $server->last_checkin );

        Logger::$severity( $this->getMessage($server) , 'App\Server', $server->id);
    }

    /**
     * Gets the message.
     *
     * @param      \App\Server  $server  The server
     */
    private function getMessage(Server $server)
    {
        return sprintf("Last checkin at [%s on %s]. Server may be offline.", 
            Carbon::parse($server->last_checkin)->format('G:i A'),
            Carbon::parse($server->last_checkin)->format('Y-m-d')
        );
    }

    /**
     * Get the severity of the issue
     * @method getSeverity
     *
     * @return   string
     */
    private function getSeverity($last_checkin)
    {
        $diff = Carbon::now()->diffInMinutes( Carbon::parse($last_checkin) );

        switch($diff) {
            case $diff < 20 : return 'ERROR';
            case $diff >= 20 && $diff < 40 : return 'CRITICAL';
            case $diff >= 40 : return 'EMERGENCY';
        }
    }

}
