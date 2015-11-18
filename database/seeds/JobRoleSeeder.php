<?php

use Illuminate\Database\Seeder;
use App\JobRole;

class JobRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      JobRole::create(['name' => 'HR Director', 'description' => 'Director of HR Division', 'manager_flag' => 1, 'org_id' => 8, 'manager_id' => 0, 'people_id' => 2]);
      JobRole::create(['name' => 'HR Manager 1',  'description' => 'Manager in HR Division', 'manager_flag' => 1, 'org_id' => 8, 'manager_id' => 1, 'people_id' => 0]);
      JobRole::create(['name' => 'HR Manager 2',  'description' => 'Manager in HR Division', 'manager_flag' => 1, 'org_id' => 8, 'manager_id' => 1, 'people_id' => 4]);
      JobRole::create(['name' => 'HR Specialist 1',  'description' => 'Specialist in HR Division', 'manager_flag' => 0, 'org_id' => 8, 'manager_id' => 2, 'people_id' => 5]);
      JobRole::create(['name' => 'HR Specialist 2',  'description' => 'Specialist in HR Division', 'manager_flag' => 0, 'org_id' => 8, 'manager_id' => 2, 'people_id' => 6]);
      JobRole::create(['name' => 'HR Specialist 3',  'description' => 'Specialist in HR Division', 'manager_flag' => 0, 'org_id' => 8, 'manager_id' => 2, 'people_id' => 7]);
      JobRole::create(['name' => 'HR Specialist 4',  'description' => 'Specialist in HR Division', 'manager_flag' => 0, 'org_id' => 8, 'manager_id' => 3, 'people_id' => 8]);
      JobRole::create(['name' => 'HR Specialist 5',  'description' => 'Specialist in HR Division', 'manager_flag' => 0, 'org_id' => 8, 'manager_id' => 3, 'people_id' => 0]);
      JobRole::create(['name' => 'HR Specialist 6',  'description' => 'Specialist in HR Division', 'manager_flag' => 0, 'org_id' => 8, 'manager_id' => 3, 'people_id' => 10]);
    }
}
