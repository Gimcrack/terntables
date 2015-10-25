<?php

use Illuminate\Database\Seeder;
use App\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker =  Faker\Factory::create();

        foreach(range(1,50) as $num) {
           Tag::create(['name' => $faker->word]);
        }
    }
}
