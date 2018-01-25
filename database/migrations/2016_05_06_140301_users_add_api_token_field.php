<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Faker\Factory;
use App\User;

class UsersAddApiTokenField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('api_token',60)->nullable();
        });

        $faker = Factory::create();

        User::all()->each( function($user) use ($faker) {
            $user->api_token = $faker->unique()->regexify('[A-Za-z0-9]{60}');
            $user->save();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('api_token');
        });
    }
}
