<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatabaseAgMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('database_ags', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('group_id');
            $table->string('primary_replica');
            $table->string('recovery_health');
            $table->string('sync_health');
            $table->string('cluster_name');
            $table->string('listener_name');
            $table->string('listener_ip');
            $table->boolean('inactive_flag')->default(0);
            $table->timestamps();
        });

        Schema::create('database_ag_members', function(Blueprint $table) {
            $table->unsignedInteger('database_ag_id');
            $table->unsignedInteger('server_id');
            $table->boolean('primary_flag')->default(0);
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
        Schema::drop('database_ag_members');

        Schema::drop('database_ags');
    }
}
