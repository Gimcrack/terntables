<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\LogEntry;

class MailLogEntry extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * The logEntry to mail.
     */
    protected $logEntry;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(LogEntry $logEntry)
    {
        $this->logEntry = $logEntry;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ( ! $this->logEntry )
        {
            return false;
        }

        $this
         ->logEntry
         ->loggable
         ->notifications()
         ->filter( function($notification) {
            return in_array($notification->notifications_enabled, ['Both','Email']);
         })
         ->each( function( $notification ) {     
            $logEntry = $this->logEntry;
            
            dispatch( new NotifierMail([
                'emails.offlineServiceNotification',
                [ 'body' => $this->getMessage( $logEntry ) ],
                $notification->email,
                "{$logEntry->level_name} on {$logEntry->loggable_type}\\{$logEntry->loggable->name}"
            ]) );
            
        });

        $this->logEntry->didNotify();
    }

    /**
     * Get the message
     *
     * @param      LogEntry  $logEntry  The log entry
     */
    private function getMessage(LogEntry $logEntry)
    {
        return sprintf("[%s on %s] %s",
            $logEntry->level_name,
            $logEntry->loggable->name,
            $logEntry->message
        );
    }
}
