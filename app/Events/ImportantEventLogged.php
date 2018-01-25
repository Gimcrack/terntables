<?php

namespace App\Events;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

use App\LogEntry;

class ImportantEventLogged extends Event
{
    use SerializesModels;

    /**
     * The Log Entry of the event
     * 
     * @type LogEntry
     */
    public $logEntry;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct( LogEntry $logEntry )
    {
        $this->logEntry = $logEntry;
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return [];
    }
}
