<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\ServerDisk;
use Logger;

class DashboardServerCheckDisks extends Command
{
    /**
     *  The free space thresholds 
     */
    const NOTICE      = 0.20;  // 20%
    const WARNING     = 0.10;  // 10%
    const ERROR       = 0.05;  //  5%
    const CRITICAL    = 0.005; // .5%
    const EMERGENCY   = 0.001; // .1%

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:serverDisks';

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
      'DSJCOMM1',
      'webdev'
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
        ServerDisk::with(['server'])
            ->gettingFull()
            ->get()
            ->reject( function($disk) {
                return $this->ignore($disk);
            })
            ->each( function($disk) {
                return $this->check($disk); 
            });
    }

    /**
     * Check the disk free space
     *
     * @param      ServerDisk  $disk   The disk
     */
    private function check( ServerDisk $disk )
    {
        $level = $this->getLevel( $disk );
        $message = $this->getMessage( $disk );

        Logger::$level( $message, 'App\Server', $disk->server->id );
    }

    /**
     * Should the disk be ignored?
     *
     * @param      ServerDisk  $disk   The disk
     */
    private function ignore( ServerDisk $disk )
    {
        return ( !! $disk->server->inactive_flag || in_array( $disk->server->name, $this->ignored ) );
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
        return "[{$disk->server->name}] Disk {$disk->name} ($disk->label) has {$disk->free_gb}/{$disk->size_gb} GB free space.";
    }

    /**
     * Get the level of the Log Entry
     *
     * @param      ServerDisk  $disk   The disk
     */
    private function getLevel( ServerDisk $disk )
    {
        $level = 'debug';

        if ( $disk->percent_free < static::NOTICE )    $level = 'notice';
        if ( $disk->percent_free < static::WARNING )   $level = 'warning';
        if ( $disk->percent_free < static::ERROR )     $level = 'error';
        if ( $disk->percent_free < static::CRITICAL )  $level = 'critical';
        if ( $disk->percent_free < static::EMERGENCY ) $level = 'emergency';

        return $level;
    }

}
