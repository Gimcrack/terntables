<?php

use Illuminate\Database\Seeder;
use App\Resource;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Resource::create([
          'name' => 'Employee Conduct Policy',
          'description' => 'Policies and rules relating to employee conduct',
          'org_id' => 8,
          'type' => 'Internal Memo',
          'location' => 'S:\Human Resources\Policies\2014-10 EmployeeConductPolicy.pdf',
        ]);

        Resource::create([
          'name' => 'Employee Leave Policy',
          'description' => 'Policies and rules relating to employee vacation and sick leave',
          'org_id' => 8,
          'type' => 'Internal Memo',
          'location' => 'S:\Human Resources\Policies\2013-06 EmployeeLeavePolicy.pdf',
        ]);
    }
}
