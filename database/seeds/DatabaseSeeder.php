<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $this->call(ColParamSeeder::class);
        $this->call(GroupsSeeder::class);
        $this->call(ModulesSeeder::class);
        $this->call(PersonSeeder::class);
        $this->call(UsersSeeder::class);
        $this->call(TagSeeder::class);
        $this->call(ServersSeeder::class);
        $this->call(ApplicationsSeeder::class);
        $this->call(DatabasesSeeder::class);

        Model::reguard();
    }
}
