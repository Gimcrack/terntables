<?php

namespace App\Listeners;

use App\Events\OutageWasModified;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Outage;

class SyncOutageTasks
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
     * @param  OutageWasModified  $event
     * @return void
     */
    public function handle(OutageWasModified $event)
    {
      if ( ! $event->outage->complete_flag ) {
        $event->outage->generateTaskDetails();
      }

    }
}
