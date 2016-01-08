<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('people', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('username')->unique();
            $table->string('email');
            $table->string('password', 60);
            $table->unsignedInteger('people_id')->nullable();
            //$table->foreign('people_id')->references('id')->on('people')->onDelete('set null');
            $table->string('comment')->nullable();
            $table->boolean('primary_flag')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('users', function(Blueprint $table) {
        //      $table->dropForeign('users_people_id_foreign');
        // });

        Schema::drop('people');

        Schema::drop('users');
    }
}
