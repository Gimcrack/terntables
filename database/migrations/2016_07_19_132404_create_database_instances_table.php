<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatabaseInstancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('database_instances', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->unsignedInteger('server_id');
            $table->unsignedInteger('group_id');
            $table->string('sql_product');
            $table->string('sql_edition');
            $table->string('sql_version');
            $table->unsignedInteger('min_memory');
            $table->unsignedInteger('max_memory');
            $table->unsignedInteger('total_memory');
            $table->unsignedInteger('processors');
            $table->string('collation');
            $table->boolean('compress_backups_flag');
            $table->unsignedInteger('max_degree_of_parallelism');
            $table->unsignedInteger('cost_threshold_of_parallelism');
            $table->boolean('inactive_flag')->default(0);
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
        Schema::drop('database_instances');
    }
}
