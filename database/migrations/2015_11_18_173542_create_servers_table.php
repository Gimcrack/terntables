<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->text('cname')->nullable();
            $table->string('ip')->unique();
            $table->boolean('inactive_flag')->default(0);
            $table->boolean('production_flag')->default(1);
            $table->date('last_windows_update')->nullable();
            $table->timestamps();
        });

        Schema::create('person_server', function (Blueprint $table) {
            $table->unsignedInteger('person_id');
            $table->foreign('person_id')->references('id')->on('people')->onDelete('cascade');
            $table->unsignedInteger('server_id');
            $table->foreign('server_id')->references('id')->on('servers')->onDelete('cascade');
            $table->string('comment')->nullable();
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
        Schema::table('person_server', function(Blueprint $table) {
          $table->dropForeign('person_server_person_id_foreign');
          $table->dropForeign('person_server_server_id_foreign');
        });

        Schema::drop('servers');
        Schema::drop('person_server');

    }


}
