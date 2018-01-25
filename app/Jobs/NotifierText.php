<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use Notifier;

class NotifierText extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * The arguments to pass to the mail method
     */
    protected $args;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct( $args )
    {
        $this->args = $args;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        call_user_func_array(['Notifier', 'text'], $this->args);
    }
}
