<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ServerServicesDropNameColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Schema::table('server_services', function (Blueprint $table) {
        //     $table->dropColumn('name');
        //     $table->unsignedInteger('service_id')->nullable();
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::table('server_services', function (Blueprint $table) {
        //     $table->string('name')->nullable();
        //     $table->dropColumn('service_id');
        // });
    }
}
