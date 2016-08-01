<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ServerDisksAddInactiveFlagColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('server_disks', function (Blueprint $table) {
            $table->boolean('inactive_flag')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('server_disks', function (Blueprint $table) {
            $table->dropColumn('inactive_flag');
        });
    }
}
