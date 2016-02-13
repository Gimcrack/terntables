<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServersApplicationsAndDatabasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      DB::transaction( function() {
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

        Schema::create('applications', function (Blueprint $table) {
          $table->increments('id');
          $table->string('name')->unique();
          $table->text('description')->nullable();
          $table->boolean('inactive_flag')->default(0);
          $table->timestamps();
        });

        Schema::create('databases', function (Blueprint $table) {
          $table->increments('id');
          $table->string('name');
          $table->text('description')->nullable();
          $table->string('rpo')->nullable();
          $table->string('rto')->nullable();
          $table->text('dr_strategy')->nullable();
          $table->text('ha_strategy')->nullable();
          $table->text('upgrade_readiness')->nullable();
          $table->boolean('inactive_flag')->default(0);
          $table->boolean('ignore_flag')->default(0);
          $table->boolean('production_flag')->default(1);
          $table->unsignedInteger('server_id');
          $table->foreign('server_id')->references('id')->on('servers')->onDelete('no action');
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

        Schema::create('database_person', function (Blueprint $table) {
          $table->unsignedInteger('person_id');
          $table->foreign('person_id')->references('id')->on('people')->onDelete('cascade');
          $table->unsignedInteger('database_id');
          $table->foreign('database_id')->references('id')->on('databases')->onDelete('cascade');
          $table->string('comment')->nullable();
          $table->string('contact_type')->nullable();
          $table->timestamps();
        });

        Schema::create('application_person', function (Blueprint $table) {
          $table->unsignedInteger('person_id');
          $table->foreign('person_id')->references('id')->on('people')->onDelete('cascade');
          $table->unsignedInteger('application_id');
          $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
          $table->string('comment')->nullable();
          $table->string('contact_type')->nullable();
          $table->timestamps();
        });

        Schema::create('application_server', function( Blueprint $table) {
          $table->unsignedInteger('server_id');
          $table->foreign('server_id')->references('id')->on('servers')->onDelete('cascade');
          $table->unsignedInteger('application_id');
          $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
          $table->string('comment')->nullable();
          $table->string('server_type')->nullable();
          $table->timestamps();
        });

        Schema::create('application_database', function( Blueprint $table) {
          $table->unsignedInteger('database_id');
          $table->foreign('database_id')->references('id')->on('databases')->onDelete('cascade');
          $table->unsignedInteger('application_id');
          $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
          $table->string('comment')->nullable();
          $table->string('database_type')->nullable();
          $table->timestamps();
        });

        Schema::create('database_server', function( Blueprint $table) {
          $table->unsignedInteger('database_id');
          $table->foreign('database_id')->references('id')->on('databases')->onDelete('cascade');
          $table->unsignedInteger('server_id');
          $table->foreign('server_id')->references('id')->on('servers')->onDelete('cascade');
          $table->string('comment')->nullable();
          $table->string('server_type')->nullable();
          $table->timestamps();
        });

      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      DB::transaction( function() {

        Schema::table('person_server', function(Blueprint $table) {
          $table->dropForeign('person_server_person_id_foreign');
          $table->dropForeign('person_server_server_id_foreign');
        });

        Schema::table('application_database', function (Blueprint $table) {
          $table->dropForeign('application_database_database_id_foreign');
          $table->dropForeign('application_database_application_id_foreign');
        });

        Schema::table('database_person', function (Blueprint $table) {
          $table->dropForeign('database_person_person_id_foreign');
          $table->dropForeign('database_person_database_id_foreign');
        });

        Schema::table('database_server', function (Blueprint $table) {
          $table->dropForeign('database_server_database_id_foreign');
          $table->dropForeign('database_server_server_id_foreign');
        });

        Schema::table('application_person', function (Blueprint $table) {
          $table->dropForeign('application_person_person_id_foreign');
          $table->dropForeign('application_person_application_id_foreign');
        });

        Schema::table('application_server', function (Blueprint $table) {
          $table->dropForeign('application_server_server_id_foreign');
          $table->dropForeign('application_server_application_id_foreign');
        });


        Schema::drop('person_server');
        Schema::drop('application_database');
        Schema::drop('application_person');
        Schema::drop('application_server');
        Schema::drop('database_person');
        Schema::drop('database_server');
        Schema::drop('databases');
        Schema::drop('servers');
        Schema::drop('applications');
    });

  }


}
