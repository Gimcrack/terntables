<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Service;

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
     * Whether to detach services that are not included with the data
     */
    protected $detach;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($server_id, $request, $detach = true)
    {
        $this->server = \App\Server::findOrFail($server_id);

        $this->services = collect( $request->all() );

        $this->detach = $detach;
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
          
        $this->server->services()->sync( $services, $this->detach );
    }

    /**
    * Get the Service by name
    *
    * @param      <type>  $name   The name
    * 
    * @return     App\Service
    */
    private function getServiceByName( $name )
    {
        $s = Service::firstOrCreate(['name' => $name]);
        
        // update the timestamp, so we know the record is up to date.
        $s->touch();
        
        return $s;
    }
}
