<?php

use Illuminate\Database\Seeder;
use App\Person;

class PersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Person::create(['first_name' => 'Jeremy', 'last_name' => 'Bloomstrom']);
    }
}
