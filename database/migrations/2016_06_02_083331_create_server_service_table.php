<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServerServiceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('server_service', function (Blueprint $table) {
            $table->unsignedInteger('service_id');
            $table->unsignedInteger('server_id');
            $table->string('status');
            $table->string('start_mode');
            $table->string('level')->default('warning');
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
        Schema::drop('server_service');
    }
}
