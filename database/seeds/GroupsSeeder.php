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
        Group::create(['name' => 'Org Viewers', 'description' => 'Widget Viewers']);
        Group::create(['name' => 'Org Managers', 'description' => 'Widget Managers']);

        foreach(range(1,10) as $i) {
          Group::create(['name' => $faker->company, 'description' => $faker->sentence(6)]);
        }
    }
}
