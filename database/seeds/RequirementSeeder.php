<?php

use Illuminate\Database\Seeder;
use App\Requirement;


class RequirementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $r = Requirement::create([
          'name' => 'HR Policy Certification',
          'description' => 'All new employees must certify in HR Policies within 30 days of hire.',
          'org_id' => 8,
          ]);

        $r->collections()->attach([1]);

        $r->jobroles()->attach([1,2,3,4,5,6,7,8]);
    }
}
