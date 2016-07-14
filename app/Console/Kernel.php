<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Notifier;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\Inspire::class,
        \App\Console\Commands\DashboardServerHealth::class,
        \App\Console\Commands\DashboardServerCheckDisks::class,
        \App\Console\Commands\DashboardServerServices::class,
        \App\Console\Commands\DashboardNotifications::class
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        if ( app()->environment() !== 'production' ) return false;

        $schedule->command('dashboard:serverHealth')
                 ->everyFiveMinutes();

        $schedule->command('dashboard:serverServices')
                 ->everyFiveMinutes();

        $schedule->command('dashboard:serverDisks critical')
                 ->everyFiveMinutes();

        $schedule->command('dashboard:serverDisks hourly')
                 ->weekdays()
                 ->hourly();

        $schedule->command('dashboard:serverDisks daily')
                 ->weekdays()
                 ->dailyAt('08:00');

        $schedule->command('dashboard:notifications fifteen')
                 ->weekdays()
                 ->everyTenMinutes()
                 ->skip( function() {
                    return Notifier::isQuietHours();
                 });

        $schedule->command('dashboard:notifications daily')
                 ->weekdays()
                 ->dailyAt('08:00');

        $schedule->command('dashboard:notifications weekly')
                 ->weekly();
    }
}
