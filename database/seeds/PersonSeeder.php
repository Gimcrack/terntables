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

        Person::create(['name' => 'Jeremy Bloomstrom']);
        Person::create(['name' => 'Amber Barnaby']);
        Person::create(['name' => 'Carla Goers']);
        Person::create(['name' => 'Davey Griffith']);
        Person::create(['name' => 'Drew Paquette']);
        Person::create(['name' => 'Ed Bennett']);
        Person::create(['name' => 'Elaine Quiboloy-Reid']);
        Person::create(['name' => 'Elizabeth Grigsby']);
        Person::create(['name' => 'Eric Goudey']);
        Person::create(['name' => 'Eric Wyatt']);
        Person::create(['name' => 'Heather Kelley']);
        Person::create(['name' => 'Jack Horner']);
        Person::create(['name' => 'June Gerteisen']);
        Person::create(['name' => 'Katie Van Sant']);
        Person::create(['name' => 'Kenneth Kleewein']);
        Person::create(['name' => 'Leah Jones']);
        Person::create(['name' => 'Margaret Cosmah']);
        Person::create(['name' => 'Mark Baker']);
        Person::create(['name' => 'Matt Rykaczewski']);
        Person::create(['name' => 'Randy Jones']);
        Person::create(['name' => 'Rod Hoskinson']);
        Person::create(['name' => 'Susan Howard']);
        Person::create(['name' => 'Susie Gibson']);
        Person::create(['name' => 'Will Sands']);
        Person::create(['name' => 'Zach McRae']);
        // $faker =  Faker\Factory::create();
        //
        // foreach(range(1,20) as $num) {
        //   Person::create(['name' => $faker->name]);
        // }
    }
}
