<?php

namespace App\Listeners;

use App\Events\DocumentWasUploaded;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;


class ProcessXMLDocument
{

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  DocumentWasUploaded  $event
     * @return void
     */
    public function handle(DocumentWasUploaded $event)
    {
        $event->document->process();
    }
}
