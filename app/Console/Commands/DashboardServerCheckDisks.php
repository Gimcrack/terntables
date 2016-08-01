<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\ServerDisk;
use App\Server;
use Logger;

class DashboardServerCheckDisks extends Command
{
    const TESTING_LEVEL = 'notice';

    /**
     *  The free space thresholds 
     */
    const NOTICE      = 0.20;  // 20%
    const WARNING     = 0.10;  // 10%
    const ERROR       = 0.05;  //  5%
    const CRITICAL    = 0.02;  //  2%
    const ALERT       = 0.01;  //  1%
    const EMERGENCY   = 0.005; // .5%
                                
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:serverDisks {which}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check server disk space';

    /**
     * Ignore these servers when doing disk space checks.
     * @var [type]
     */
    protected $ignored = [
      'DSJCOMM1' => '*',
      'webdev' => '*',
    ];

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        switch ( $this->argument('which') ) // daily | hourly | critical
        {
          case 'daily' : 
            $max = static::NOTICE; 
            $min = static::ERROR;
            break;
            
          case 'hourly' : 
            $max = static::ERROR; 
            $min = static::CRITICAL;
            break;
            
          default : 
            $max = static::CRITICAL; 
            $min = 0;
        }

        ServerDisk::with(['server'])
            ->gettingFull( $max, $min )
            ->get()
            ->reject( function($disk) {
                return $this->ignore($disk);
            })
            ->each( function($disk) {
                return $this->log($disk); 
            });
    }

    /**
     * Log the disk that's getting full
     *
     * @param      ServerDisk  $disk   The disk
     */
    private function log( ServerDisk $disk )
    {
        $level = $this->getLevel( $disk );
        $message = $this->getMessage( $disk );

        Logger::$level( $message, 'App\ServerDisk', $disk->id );
    }

    /**
     * Should the disk be ignored?
     *
     * @param      ServerDisk  $disk   The disk
     */
    private function ignore( ServerDisk $disk )
    {
        return ( !! $disk->inactive_flag || ! $disk->server || !! $disk->server->inactive_flag || $this->is_ignored_server($disk->server) );
    }

    /**
     * Determines if ignored server.
     *
     * @param      Server  $server  The server
     */
    private function is_ignored_server( Server $server )
    {
        return isset( $this->ignored[$server->name] );
    }

    /**
     * Gets the message.
     *
     * @param      ServerDisk  $disk   The disk
     *
     * @return     <type>      The message.
     */
    private function getMessage( ServerDisk $disk )
    {
        return sprintf( "{$disk->name} [$disk->label] on [%s] has %s/%s GB (%s%%) free space as of %s.",
            $disk->server->name,
            number_format($disk->free_gb,0),
            number_format($disk->size_gb,0),
            number_format($disk->percent_free*100,2),
            $disk->updated_at->diffForHumans()
        );
    }

    /**
     * Get the level of the Log Entry
     *
     * @param      ServerDisk  $disk   The disk
     */
    private function getLevel( ServerDisk $disk )
    {
        if ( ! $disk->server->production_flag )
        {
            return static::TESTING_LEVEL;
        }

        $percent_free = $disk->percent_free;
        switch(true)
        {
            case $percent_free < static::EMERGENCY    : return 'emergency';
            case $percent_free < static::ALERT        : return 'alert';
            case $percent_free < static::CRITICAL     : return 'critical';
            case $percent_free < static::ERROR        : return 'error';
            case $percent_free < static::WARNING      : return 'warning';
            case $percent_free < static::NOTICE       : return 'notice';
        }
        return 'info';
    }

}
