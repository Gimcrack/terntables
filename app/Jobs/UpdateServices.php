<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateServices extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * The server to update
     */
    protected $server;

    /**
     * The services to process
     */
    protected $services;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($server_id, $request)
    {
        $this->server = \App\Server::findOrFail($server_id);

        $this->services = collect( $request->all() );
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $services = $this->services // iterate through the services
          
          ->reject( function( $service ) {
            return empty($service['name']);
          })

          ->map( function($service) {
            $service['service_id'] = $this->getServiceByName( $service['name'] )->id;
            unset($service['name']);
            return $service;
          })

          ->keyBy('service_id')
          ->toArray();
          
        $this->server->services()->sync( $services );
    }
}
