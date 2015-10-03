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

        User::create(['name' => 'Jeremy Bloomstrom', 'username' => 'jeremy', 'email' => 'jeremy.bloomstrom@gmail.com', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([1,3]);
        User::create(['name' => 'Jeremy Bloomstrom', 'username' => 'jeremyadmin', 'email' => 'jeremyadmin@matsugov.us', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([1,3]);
        User::create(['name' => 'Jeremy Bloomstrom', 'username' => 'jb30111', 'email' => 'jeremy.bloomstrom@matsugov.us', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([1,3]);

        foreach(range(1,25) as $id)
        {
          User::create(['name' => $faker->name, 'username' => $faker->username, 'email' => $faker->email, 'password' => bcrypt('P@ssw0rd')])->groups()->attach($faker->randomDigitNotNull);
        }
    }
}
