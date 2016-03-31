<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Server;
use App\Notification;
use App\Dashboard\Notifier;
use Illuminate\Database\Eloquent\Collection;

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
        $late_servers = Server::lateCheckingIn()->get();

        if ( $late_servers->count() )
        {
          $this->sendNotifications($late_servers);
        }

    }

    /**
     * Send the notifications for the late servers
     * @method sendNotifications
     * @param  Collection        $servers [description]
     * @return [type]                     [description]
     */
    public function sendNotifications(Collection $servers)
    {
      $body = $this->getLateServerNotification($servers);

      // send a text message to the system admin
      Notifier::text( env('ADMIN_PHONE'), $body );

      // send an email message to the system admin
      Notifier::mail( 'emails.lateServerNotification', compact('servers') );
    }



    /**
     * get the notification message for a late server
     * @method getLateServerNotification
     * @param  [type]                    $server_names [description]
     * @return [type]                                  [description]
     */
    public function getLateServerNotification(Collection $servers)
    {
      $server_names = [];

      foreach($servers as $server)
      {
        $server_names[] = $server->name . " (" . $server->updated_at_for_humans . ")";
      }

      return "\nMSB Dashboard Warning:\nServer(s) late checking in:\n -- " . implode("\n -- ",$server_names) . "\n-Reported at " . date("Y-m-d H:i:s");
    }

}
