<?php

use Illuminate\Database\Seeder;
use App\Org;

class OrgSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Org::create(['name' => 'Acme', 'description' => 'Maker of fine widgets since 1940']);
        Org::create(['name' => 'Finance', 'description' => 'Finance Department','parent_id' => 1]);
        Org::create(['name' => 'Accounts Payable', 'description' => 'AP Division', 'parent_id' => 2]);
        Org::create(['name' => 'Accounts Receivable', 'description' => 'AR Division', 'parent_id' => 2]);
        Org::create(['name' => 'Purchasing', 'description' => 'Purchasing Section', 'parent_id' => 3]);
        Org::create(['name' => 'Collections', 'description' => 'Collections Section', 'parent_id' => 4]);
        Org::create(['name' => 'Administration', 'description' => 'Admin Department', 'parent_id' => 1]);
        Org::create(['name' => 'Human Resources', 'description' => 'HR Division', 'parent_id' => 7]);

    }
}
