<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateDetailsAddSupersededFlagColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('update_details', function (Blueprint $table) {
            $table->boolean('superseded_flag')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('update_details', function (Blueprint $table) {
            $table->dropColumn('superseded_flag');
        });
    }
}
