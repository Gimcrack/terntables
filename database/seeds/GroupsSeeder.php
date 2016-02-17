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
        $faker = Faker\Factory::create();

        //empty table first
        //Group::truncate();

        Group::create(['name' => 'Super Administrators', 'description' => 'Super Administrators']);
        Group::create(['name' => 'Administrators', 'description' => 'Administrators']);
        Group::create(['name' => 'AD Users', 'description' => 'AD Users']);
        Group::create(['name' => 'IT', 'description' => 'Information Technology']);


        Group::create(['name' => 'Managers', 'description' => 'Managers']);


        Group::create(['name' => 'BIT', 'description' => 'Business Integration Team']);
        Group::create(['name' => 'GIS', 'description' => 'GIS Team']);
        Group::create(['name' => 'SD',  'description' => 'Service Desk Team']);
        Group::create(['name' => 'TI',  'description' => 'Technology Infrastructure Team']);


        // Group::create(['name' => 'Org Viewers', 'description' => 'Widget Viewers']);
        // Group::create(['name' => 'Org Managers', 'description' => 'Widget Managers']);

        // foreach(range(1,10) as $i) {
        //   Group::create(['name' => $faker->company, 'description' => $faker->sentence(6)]);
        // }
    }
}
