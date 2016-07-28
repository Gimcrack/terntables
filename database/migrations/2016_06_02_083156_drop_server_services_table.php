<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropServerServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Schema::drop('server_services');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('server_services', function (Blueprint $table) {
        //     $table->increments('id');
        //     $table->unsignedInteger('service_id')->nullable();
        //     $table->unsignedInteger('server_id');
        //     $table->string('status');
        //     $table->string('start_mode');
        //     $table->timestamps();
        // });
    }
}
