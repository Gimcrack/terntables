<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\LogEntry;

class TextLogEntry extends Job implements ShouldQueue
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
        $this
         ->logEntry
         ->loggable
         ->notifications()
         ->filter( function($notification) {
            return in_array($notification->notifications_enabled, ['Both','Text']);
        })
         ->each( function( $notification ) {
            $logEntry = $this->logEntry;

            dispatch( new NotifierText([
                $notification->phone_number, 
                $this->getMessage( $logEntry )
            ]));
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
