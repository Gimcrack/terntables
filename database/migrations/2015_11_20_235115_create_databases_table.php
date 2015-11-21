<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatabasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
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

        Schema::create('application_database', function( Blueprint $table) {
          $table->unsignedInteger('database_id');
          $table->foreign('database_id')->references('id')->on('databases')->onDelete('cascade');
          $table->unsignedInteger('application_id');
          $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
          $table->string('comment')->nullable();
          $table->timestamps();
        });

        Schema::create('database_person', function (Blueprint $table) {
          $table->unsignedInteger('person_id');
          $table->foreign('person_id')->references('id')->on('people')->onDelete('cascade');
          $table->unsignedInteger('database_id');
          $table->foreign('database_id')->references('id')->on('databases')->onDelete('cascade');
          $table->string('comment')->nullable();
          $table->timestamps();
        });

        Schema::create('database_server', function( Blueprint $table) {
          $table->unsignedInteger('database_id');
          $table->foreign('database_id')->references('id')->on('databases')->onDelete('cascade');
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
      Schema::table('application_database', function (Blueprint $table) {
        $table->dropForeign('application_database_database_id_foreign');
        $table->dropForeign('application_database_application_id_foreign');
      });
      Schema::drop('application_database');

      Schema::table('database_person', function (Blueprint $table) {
        $table->dropForeign('database_person_person_id_foreign');
        $table->dropForeign('database_person_database_id_foreign');
      });
      Schema::drop('database_person');

      Schema::table('database_server', function (Blueprint $table) {
        $table->dropForeign('database_server_database_id_foreign');
        $table->dropForeign('database_server_server_id_foreign');
      });
      Schema::drop('database_server');

      Schema::drop('databases');
    }
}
