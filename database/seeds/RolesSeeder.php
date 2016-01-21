<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //empty table first
        //Role::truncate();


        Role::create([
          'name' => 'Org Managers',
          'model' => 'Org',
          'description' => 'Can create, update, and delete orgs',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(5);

        Role::create([
          'name' => 'Org Viewers',
          'model' => 'Org',
          'description' => 'Can view orgs',
          'read_enabled' => 1,
        ])->groups()->attach(4);
    }
}
