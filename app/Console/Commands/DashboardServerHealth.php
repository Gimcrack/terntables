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
        Logger::error( $this->getMessage($server) , 'App\Server', $server->id);
    }

    /**
     * Gets the message.
     *
     * @param      \App\Server  $server  The server
     */
    private function getMessage(Server $server)
    {
        return sprintf("Last checkin: %s", (new Carbon($server->last_checkin))->diffForHumans() );
    }

}
