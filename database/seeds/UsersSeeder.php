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
        User::create(['name' => 'Jeremy Bloomstrom', 'username' => 'jeremy', 'email' => 'jeremy.bloomstrom@gmail.com', 'password' => bcrypt('P@ssw0rd')])->groups()->attach([1,3]);


    }
}
