<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Dashboard\Monolog\DashboardHandler;

class DashboardServiceProvider extends ServiceProvider
{

    /**
     * Register any other events for your application.
     *
     * @param  
     * @return void
     */
    public function boot()
    {
        $handler = new DashboardHandler();
        //app('log')->getMonolog()->pushHandler($handler);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
