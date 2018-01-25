<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Server;

class UpdateAgent extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * The server to update
     */
    protected $server;

    /**
     * The Agent Status
     */
    protected $status;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($server_id, $request)
    {
        $this->server = \App\Server::findOrFail($server_id);

        $this->status = $request->get('status');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->server->update( ['agent_status' => $this->status] );
    }

}
