<?php

namespace App\Events;

use App\Events\Event;
use App\Outage;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class OutageWasModified extends Event
{
    use SerializesModels;

    public $outage;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Outage $outage)
    {
        $this->outage = $outage;
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
