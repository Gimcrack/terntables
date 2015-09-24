<?php

use Illuminate\Database\Seeder;
use App\Group;

class GroupsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Group::create(['name' => 'Super Administrators', 'description' => 'Super Administrators']);
        Group::create(['name' => 'Administrators', 'description' => 'Administrators']);
        Group::create(['name' => 'AD Users', 'description' => 'AD Users']);
    }
}
