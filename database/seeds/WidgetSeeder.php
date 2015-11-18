<?php

use Illuminate\Database\Seeder;
use App\Widget;

class WidgetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker =  Faker\Factory::create();

        foreach( range(1,50) as $num ) {
          $w = Widget::create( [
            'name' => $faker->word,
            'description' => $faker->paragraph(2),
            'product_id' => $faker->uuid,
            'status' => $faker->word,
            'quantity' => $faker->randomDigit
          ]);

          $attach = [];
          foreach( range(1, $faker->randomDigitNotNull ) as $num ) {
            $f = Faker\Factory::create();
            $attach[] = $f->unique()->randomDigitNotNull;
          }

          $w->tags()->sync($attach);
        }
    }
}
