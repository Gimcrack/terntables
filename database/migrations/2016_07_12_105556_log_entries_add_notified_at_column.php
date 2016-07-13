<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class LogEntriesAddNotifiedAtColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('log_entries', function (Blueprint $table) {
            $table->datetime('notified_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('log_entries', function (Blueprint $table) {
            $table->dropColumn('notified_at');
        });
    }
}
