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
        //$this->call(WidgetSeeder::class);
        $this->call(OrgSeeder::class);
        $this->call(JobRoleSeeder::class);
        $this->call(ResourceSeeder::class);
        $this->call(CollectionSeeder::class);
        $this->call(RequirementSeeder::class);

        Model::reguard();
    }
}
