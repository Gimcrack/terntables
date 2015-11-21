<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateApplicationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
          $table->increments('id');
          $table->string('name')->unique();
          $table->text('description')->nullable();
          $table->boolean('inactive_flag')->default(0);
          $table->timestamps();
        });

        Schema::create('application_person', function (Blueprint $table) {
          $table->unsignedInteger('person_id');
          $table->foreign('person_id')->references('id')->on('people')->onDelete('cascade');
          $table->unsignedInteger('application_id');
          $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
          $table->string('comment')->nullable();
          $table->timestamps();
        });

        Schema::create('application_server', function( Blueprint $table) {
          $table->unsignedInteger('server_id');
          $table->foreign('server_id')->references('id')->on('servers')->onDelete('cascade');
          $table->unsignedInteger('application_id');
          $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
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
        Schema::table('application_person', function (Blueprint $table) {
          $table->dropForeign('application_person_person_id_foreign');
          $table->dropForeign('application_person_application_id_foreign');
        });
        Schema::drop('application_person');

        Schema::table('application_server', function (Blueprint $table) {
          $table->dropForeign('application_server_server_id_foreign');
          $table->dropForeign('application_server_application_id_foreign');
        });
        Schema::drop('application_server');

        Schema::drop('applications');
    }
}
