<?php

namespace App\Listeners;

use App\LogEntry;
use App\Events\ImportantEventLogged;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Notifier;

class SendNotification
{
    /**
     * Handle the event.
     *
     * @param  ImportantEventLogged  $event
     * @return void
     */
    public function handle(ImportantEventLogged $event)
    {
        $logEntry = $event->logEntry;

        if ( Notifier::shouldNotify( $logEntry ) )
        {
            $this->mail($logEntry);
            $this->text($logEntry);

            $logEntry->didNotify();
        }
    }

    /**
     * Send the mail notifications
     *
     * @param      LogEntry  $logEntry  The log entry
     */
    private function mail(LogEntry $logEntry)
    {
        $logEntry
         ->loggable
         ->notifications()
         ->filter( function($notification) {
            return in_array($notification->notifications_enabled, ['Both','Email']);
        })
         ->each( function( $notification ) use ( $logEntry ) {
            
            Notifier::mail('emails.offlineServiceNotification'
                , ['body' => $logEntry->message]
                , $notification->email
                , "{$logEntry->level_name} on {$logEntry->loggable_type}\\{$logEntry->loggable->name}"
            );
        });
    }

    /**
     * Send the text notifications
     *
     * @param      LogEntry  $logEntry  The log entry
     */
    private function text(LogEntry $logEntry)
    {
        $logEntry
         ->loggable
         ->notifications()
         ->filter( function($notification) {
            return in_array($notification->notifications_enabled, ['Both','Text']);
        })
         ->each( function( $notification ) use ( $logEntry ) {
            $body = sprintf("[%s on %s] %s",
                $logEntry->level_name,
                $logEntry->loggable->name,
                $logEntry->message
            );
            Notifier::text($notification->phone_number, $body);
        });
    }
}
