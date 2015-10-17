<?php

namespace App\Events;

use App\Events\Event;
use App\Document;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class DocumentWasUploaded extends Event
{
    use SerializesModels;

    public $document;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Document $document)
    {
        $this->document = $document;
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
