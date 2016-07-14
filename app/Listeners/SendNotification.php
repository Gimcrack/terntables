<?php

namespace App\Listeners;

use App\LogEntry;
use App\Events\ImportantEventLogged;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Notifier;

use App\Jobs\MailLogEntry;

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
            dispatch( new MailLogEntry($logEntry) );
            dispatch( new TextLogEntry($logEntry) );
        }
    }


    
}
