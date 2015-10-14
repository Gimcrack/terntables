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
        //empty table first
        Person::truncate();
        
        Person::create(['name' => 'Jeremy Bloomstrom']);
    }
}
