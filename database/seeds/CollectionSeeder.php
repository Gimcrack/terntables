<?php

use Illuminate\Database\Seeder;
use App\Collection;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Collection::create([
          'name' => 'HR Policies',
          'description' => 'Employee HR Policy Materials',
          'org_id' => 8,
        ])->resources()->attach([1,2]);
    }
}
