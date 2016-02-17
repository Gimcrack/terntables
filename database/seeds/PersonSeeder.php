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
        //Person::truncate();

        Person::create(['name' => 'Jeremy Bloomstrom']);          // 1
        Person::create(['name' => 'Amber Barnaby']);              // 2
        Person::create(['name' => 'Carla Goers']);                // 3
        Person::create(['name' => 'Davey Griffith']);             // 4
        Person::create(['name' => 'Drew Paquette']);              // 5
        Person::create(['name' => 'Ed Bennett']);                 // 6
        Person::create(['name' => 'Dan Cappel']);                 // 7
        Person::create(['name' => 'Elizabeth Grigsby']);          // 8
        Person::create(['name' => 'Eric Goudey']);                // 9
        Person::create(['name' => 'Eric Wyatt']);                 // 10
        Person::create(['name' => 'Heather Kelley']);             // 11
        Person::create(['name' => 'Jack Horner']);                // 12
        Person::create(['name' => 'Jason Bailey']);               // 13
        Person::create(['name' => 'Katie Van Sant']);             // 14
        Person::create(['name' => 'Kenneth Kleewein']);           // 15
        Person::create(['name' => 'Leah Jones']);                 // 16
        Person::create(['name' => 'Margaret Cosmah']);            // 17
        Person::create(['name' => 'Mark Baker']);                 // 18
        Person::create(['name' => 'Matt Rykaczewski']);           // 19
        Person::create(['name' => 'Randy Jones']);                // 20
        Person::create(['name' => 'Rod Hoskinson']);              // 21
        Person::create(['name' => 'Susan Howard']);               // 22
        Person::create(['name' => 'Susie Gibson']);               // 23
        Person::create(['name' => 'Will Sands']);                 // 24
        Person::create(['name' => 'Zach McRae']);                 // 25
        Person::create(['name' => 'Nicole Vasquez']);             // 26
        Person::create(['name' => 'Katie Richardson']);           // 27
        // $faker =  Faker\Factory::create();
        //
        // foreach(range(1,20) as $num) {
        //   Person::create(['name' => $faker->name]);
        // }
    }
}
