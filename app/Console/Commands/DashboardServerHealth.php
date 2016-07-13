<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Server;
use Carbon\Carbon;
use Logger;

// use App\Alert;
// use App\Notification;
// use App\ServerDisk;
// use App\Dashboard\Notifier;
// use Illuminate\Database\Eloquent\Collection;


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
    protected $description = 'Queries the servers table and sends notifications of any alerts.';

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
      $this->process();
    }

    /**
     * Process servers that are late checking in.
     * @method process
     * @return [type]           [description]
     */
    public function process()
    {
      $late_servers = $this->getLateServers()->each( function(Server $server)
      {
        $message = sprintf("Last checkin: %s", (new Carbon($server->last_checkin))->diffForHumans() );
        Logger::error($message, 'App\Server', $server->id);
      });
    }

    /**
     * Get servers that are late checking in.
     * @method checkLateServers
     * @return [type]           [description]
     */
    private function getLateServers()
    {
      return Server::lateCheckingIn()->get();
    }

}
