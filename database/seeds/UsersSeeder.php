<?php

use Illuminate\Database\Seeder;
use App\User;

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

        User::create(['people_id' => 1, 'username' => 'jeremy', 'email' => 'jeremy.bloomstrom@gmail.com', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([1,3]);
        User::create(['people_id' => 1, 'username' => 'jeremyadmin', 'email' => 'jeremyadmin@matsugov.us', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([1,3]);
        User::create(['people_id' => 1, 'username' => 'jb30111', 'email' => 'jeremy.bloomstrom@matsugov.us', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([1,3]);
        User::create(['people_id' => 1, 'username' => 'jeremy_standard', 'email' => 'jeremy_standard@matsugov.us', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([4]);
        User::create(['people_id' => 1, 'username' => 'jeremy_manager', 'email' => 'jeremy_manager@matsugov.us', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([5]);

        // foreach(range(1,25) as $id)
        // {
        //   User::create(['username' => $faker->username, 'email' => $faker->email, 'password' => bcrypt('P@ssw0rd')])->groups()->attach($faker->randomDigitNotNull);
        // }
    }
}
