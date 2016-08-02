<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\LogEntry;
use App\Notification;
use Notifier;
use Exception;

use App\Jobs\NotifierMail;

class DashboardNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:notifications {which}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send out notifications about logged events.';

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
        $which = $this->argument('which');
        return $this->$which();
    }

    private function mail($notifications, $logEntries)
    {
        // send the mail messages
        $notifications
          ->filter( function( $notification ) {
            return in_array($notification->notifications_enabled, ['Both','Email']);
          })
          ->each( function( $notification ) use ($logEntries) {
            dispatch( new NotifierMail([
                'emails.notificationDigest'
                ,[ 'logEntries' => $logEntries ]
                ,$notification->email
                ,'IT Dashboard Notifications'
            ]) );
          });
    }

    /**
     * Send a digest of logged events
     *
     * @param      string  $which  The which
     */
    private function digest($which = 'fifteen')
    {
        $logEntries = LogEntry::with('loggable')
            ->unnotified() // turn this off for testing
            ->$which()
            ->byLevel()
            ->get()
            ->each( function( $logEntry ) {
                $logEntry->didNotify();
            })
            ->reject( function( $logEntry ) {
                return $logEntry->isSilenced();
            })
            ->unique( function($logEntry) {
                return $logEntry->message . $logEntry->loggable_type . $logEntry->loggable_id;
            })
            ->groupBy( function( $logEntry ) {
                return $logEntry->loggable->group_id;
            })
            ->each( function( $logEntries, $group_id ) {
                $notifications = Notification::where('group_id',$group_id)->get();
                $this->mail( $notifications, $logEntries );
            });
    }

    /**
     * Send a weekly digest of logged INFO, and DEBUG events
     */
    private function weekly()
    {
        $this->digest('weekly');
    }

    /**
     * Send a daily digest of logged WARNING and NOTICE events
     *
     */
    private function daily()
    {
        $this->digest('daily');
    }

    /**
     * Send a digest of logged ERROR and ALERT events
     */
    private function fifteen()
    {
        $this->digest('fifteen');
    }

}
