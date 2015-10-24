<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Person;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();

        //empty table first
        //User::truncate();
        Person::create(['name' => 'Ozmataz Buckshank']);
        User::create(['people_id' => 1, 'username' => 'admin', 'email' => 'admin@acme.com', 'password' => bcrypt('demoadmin')])->groups()->attach([2,3]);

        foreach(range(1,50) as $num) {
          $person = Person::create(['name' => $faker->name ]  );
          User::create(['people_id' => $person->id, 'username' => $faker->username, 'email' => $faker->email, 'password' => bcrypt('demouser')])->groups()->attach([3,4]);
        }

    }
}
