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

        Person::create(['name' => 'John Smith']);
        User::create(['people_id' =>2, 'username' => 'admin2', 'email' => 'admin2@acme.com', 'password' => bcrypt('demoadmin')])->groups()->attach([2,3]);

        foreach(range(1,50) as $num) {
          $person = Person::create(['name' => $faker->name ]  );
          $user = User::create(['people_id' => $person->id, 'username' => $faker->username, 'email' => $faker->email, 'password' => bcrypt('demouser')]);


          $attach = [3,4];
          foreach( range(1, $faker->randomDigitNotNull ) as $num ) {
            $f = Faker\Factory::create();
            $attach[] = $f->unique()->randomDigitNotNull;
          }

          $user->groups()->sync($attach);

        }

    }
}
