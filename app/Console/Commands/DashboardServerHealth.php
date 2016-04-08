<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Server;
use App\Alert;
use App\Notification;
use App\Dashboard\Notifier;
use Illuminate\Database\Eloquent\Collection;
use Log;

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
      $this->checkServerAlerts();

      $this->checkLateServers();
    }


    /**
     * Check servers that are late checking in.
     * @method checkLateServers
     * @return [type]           [description]
     */
    public function checkLateServers()
    {
      $late_servers = Server::lateCheckingIn()->get();

      if ( $late_servers->count() )
      {
        $this->sendLateServerNotifications($late_servers);
      }

    }

    /**
     * Check if there are any unreported server alerts and process
     * @method checkServerAlerts
     * @return [type]            [description]
     */
    public function checkServerAlerts()
    {
      $alerts = Alert::with(['alertable'])->serverAlerts()->unnotified()->get();

      foreach($alerts as $alert)
      {
        $server = $alert->alertable;
        $notifications = $server->notifications();
        $body = $alert->message;

        foreach( $notifications as $notification)
        {

          if ( $notification->notifications_enabled == 'Both' || $notifications->notifications_enabled == 'Email' )
          {
            Notifier::mail('emails.offlineServiceNotification'
              , compact('body')
              , $notification->email
              , "Service Error on {$server->name}"
            );
          }

          if ( $notification->notifications_enabled == 'Both' || $notifications->notifications_enabled == 'Text' )
          {
            Notifier::text($notification->phone_number, $body);
          }
        } // end foreach

        Log::warning($alert->message);

        $alert->notification_sent_flag = 1;
        $alert->save();

      } // end foreach
    }

    /**
     * Send the notifications for the late servers
     * @method sendNotifications
     * @param  Collection        $servers [description]
     * @return [type]                     [description]
     */
    public function sendLateServerNotifications(Collection $servers)
    {
      $body = $this->getLateServerNotification($servers);

      // make sure it's not quiet hours
      if ( ! Notifier::isQuietHours() )
      {
        // send a text message to the system admin
        Notifier::text( env('ADMIN_PHONE'), $body );

        // send an email message to the system admin
        Notifier::mail( 'emails.lateServerNotification', compact('servers') );
      } else {
        // just log a warning instead
        Log::warning($body);
      }
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
        // create the alert
        Alert::create([
          'message' => "Server {$server->name} last checked in: {$server->updated_at_for_humans}.",
          'alertable_id' => $server->id,
          'alertable_type' => 'App\Server',
          'notification_sent_flag' => 1
        ]);

        $server_names[] = $server->name . " (" . $server->updated_at_for_humans . ")";
      }

      return "\nMSB Dashboard Warning:\nServer(s) late checking in:\n -- " . implode("\n -- ",$server_names) . "\n-Reported at " . date("Y-m-d H:i:s");
    }

}
