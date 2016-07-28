<?php

namespace App\Console\Commands;

use Logger;
use Carbon;
use App\ServerAgent;
use Illuminate\Console\Command;

class DashboardServerAgentHealth extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:serverAgentHealth';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check on the server agents and log any that are late checking in.';

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
        ServerAgent::lateCheckingIn()
        ->get()
        ->each( function(ServerAgent $agent) {
            $this->log($agent);
        });
    }

    /**
     * Log the error
     *
     * @param      \App\ServerAgent  $agent  The server agent
     */
    private function log(ServerAgent $agent)
    {
        Logger::error( $this->getMessage($agent) , 'App\ServerAgent', $agent->id);
    }

    /**
     * Gets the message.
     *
     * @param      \App\ServerAgent  $agent  The agent agent
     */
    private function getMessage(ServerAgent $agent)
    {
        return sprintf("Last checkin: %s", (new Carbon($agent->updated_at))->diffForHumans() );
    }



}
