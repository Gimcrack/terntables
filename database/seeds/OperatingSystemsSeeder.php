<?php

use Illuminate\Database\Seeder;
use App\OperatingSystem;

class OperatingSystemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        OperatingSystem::create(['name' => 'Windows Server 2012 R2']);
        OperatingSystem::create(['name' => 'Windows Server 2008 R2']);
        OperatingSystem::create(['name' => 'Windows Server 2003']);
        OperatingSystem::create(['name' => 'Linux']);
        OperatingSystem::create(['name' => 'Other']);
    }
}
