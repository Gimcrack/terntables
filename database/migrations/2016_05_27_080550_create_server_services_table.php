<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServerServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Schema::create('server_services', function (Blueprint $table) {
        //     $table->increments('id');
        //     $table->string('name');
        //     $table->unsignedInteger('server_id');
        //     $table->string('status');
        //     $table->string('start_mode');
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::drop('server_services');
    }
}
