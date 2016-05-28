<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Server;
use App\Alert;
use App\Notification;
use App\ServerDisk;
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
        $body = str_replace( "\n", "<br/>", $alert->message );

        if ( $this->shouldSendAlert($alert) )
        {
          foreach( $notifications as $notification )
          {
            if ( $notification->notifications_enabled == 'Both' || $notification->notifications_enabled == 'Email' )
            {
              Log::info("Sending Email Notification to {$notification->email}");
              Notifier::mail('emails.offlineServiceNotification'
                , compact('body')
                , $notification->email
                , "Error on {$server->name}"
              );
            }

            if ( $notification->notifications_enabled == 'Both' || $notification->notifications_enabled == 'Text' )
            {
              Log::info("Sending Text Notification to {$notification->phone_number}");
              Notifier::text($notification->phone_number, $alert->message);
            }
          } // end foreach
        }

        Log::warning($alert->message);

        $alert->notification_sent_flag = 1;
        $alert->save();

      } // end foreach
    }

    /**
     * Should the alert be sent?
     * @method shouldSendAlert
     * @return [type]          [description]
     */
    public function shouldSendAlert(Alert $alert)
    {
      $server = $alert->alertable;
      $quiet = Notifier::isQuietHours( $server->production_flag );
      $outage = Notifier::isOutage();

      if ( !! $server->inactive_flag )
      {
        Log::info("Alert suppressed for inactive server");
        return false;
      }

      if ( !! $outage ) {
        Log::info("Alert suppressed due to: outage window");
        return false;
      }

      if ( ! $quiet ) return true;

      // quiet hours, don't send alerts for nonprod servers
      if ( ! $server->production_flag ) {
        Log::info("Alert suppressed for test server due to: quiet hours enforced");
        return false;
      }

      // quiet hours, production server - send if there have been more than the threshold in the past hour
      if ( $server->alerts()->recent()->count() >= config('alerts.production_alert_threshold') )
      {
        Log::info("Alert allowed for production server due to: threshold reached during quiet hours");
        return true;
      }

      Log::info("Alert suppressed for production server due to: quiet hours enforced");
      return false;

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
