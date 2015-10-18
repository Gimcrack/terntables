<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Module;

class ModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //empty table first
        //Module::truncate();


        Module::create([
          'name' => 'Document',
          'role' => 'Document Managers',
          'description' => 'Can create, update, and delete documents',
          'create_enabled' => 1,
          'read_enabled' => 1,
          'update_enabled' => 1,
          'delete_enabled' => 1,
        ])->groups()->attach(5);

        Module::create([
          'name' => 'Document',
          'role' => 'Document Viewers',
          'description' => 'Can view documents',
          'read_enabled' => 1,
        ])->groups()->attach(4);
    }
}
