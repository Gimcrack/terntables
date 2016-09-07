<?php

namespace App\Console\Commands;

use DB;
use Notifier;
use Exception;
use App\LogEntry;
use Carbon;
use App\Notification;
use App\Jobs\NotifierMail;
use Illuminate\Console\Command;

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
        $logEntries = collect( DB::table('vw_log_entries')
            ->whereNull('notified_at') // turn this off for testing
            ->where('loggable_type','<>','App\Application')
            ->where('loggable_id','<>',9)
            ->where( function($q) use ($which) {
                switch($which) {
                    case 'fifteen' : return $q->whereIn('level_name',['ERROR','CRITICAL']);
                    case 'daily' : return $q->whereIn('level_name',['WARNING','NOTICE']);
                    case 'weekly' : return $q->whereIn('level_name',['INFO','DEBUG']);
                }
            })
            ->orderBy('level','DESC')
            ->get()
        );
            
        LogEntry::whereNull('notified_at') 
            ->where('loggable_type','<>','App\Application')
            ->where('loggable_id','<>',9)
            ->where( function($q) use ($which) {
                switch($which) {
                    case 'fifteen' : return $q->whereIn('level_name',['ERROR','CRITICAL','ALERT','EMERGENCY']);
                    case 'daily' : return $q->whereIn('level_name',['WARNING','NOTICE']);
                    case 'weekly' : return $q->whereIn('level_name',['INFO','DEBUG']);
                }
            })->update(['notified_at' => Carbon::now()] );

        $logEntries->reject( function( $logEntry ) {
                return LogEntry::find($logEntry->id)->isSilenced();
            })
            ->unique( function($logEntry) {
                return $logEntry->message . $logEntry->loggable_type . $logEntry->loggable_id;
            })
            ->groupBy( function( $logEntry ) {
                return $logEntry->group_id;
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
