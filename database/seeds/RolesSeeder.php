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
          'name' => 'Outage Managers',
          'model' => 'Outage',
          'description' => 'Can create, update, and delete Outages',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(10);

        Role::create([
          'name' => 'Outage Task Managers',
          'model' => 'OutageTask',
          'description' => 'Can create, update, and delete Outage Tasks',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(10);

        Role::create([
          'name' => 'Outage Task Detail Managers',
          'model' => 'OutageTaskDetail',
          'description' => 'Can create, update, and delete Outage Task Details',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(10);

        Role::create([
          'name' => 'Server Managers',
          'model' => 'Server',
          'description' => 'Can create, update, and delete Servers',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(6);

        Role::create([
          'name' => 'Application Managers',
          'model' => 'Application',
          'description' => 'Can create, update, and delete Applcations',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(6);

        Role::create([
          'name' => 'Database Managers',
          'model' => 'Database',
          'description' => 'Can create, update, and delete Databases',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(6);

        Role::create([
          'name' => 'GIS Document Managers',
          'model' => 'Document',
          'description' => 'Can create, update, and delete GIS Documents',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(7);


    }
}
