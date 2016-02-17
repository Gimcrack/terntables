<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOutageTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      DB::transaction( function() {
        Schema::create('outage_tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->text('task_type')->default('Server Task');
            $table->boolean('inactive_flag')->default(0);
            $table->unsignedInteger('group_id')->nullable(); // owner
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('outage_outage_task', function (Blueprint $table) {
            $table->unsignedInteger('outage_id');
            $table->foreign('outage_id')->references('id')->on('outages')->onDelete('cascade');
            $table->unsignedInteger('outage_task_id');
            $table->foreign('outage_task_id')->references('id')->on('outage_tasks')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('application_outage_task', function (Blueprint $table) {
            $table->unsignedInteger('application_id');
            $table->foreign('application_id')->references('id')->on('applications')->onDelete('cascade');
            $table->unsignedInteger('outage_task_id');
            $table->foreign('outage_task_id')->references('id')->on('outage_tasks')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('operating_system_outage_task', function (Blueprint $table) {
            $table->unsignedInteger('operating_system_id');
            $table->foreign('operating_system_id')->references('id')->on('operating_systems')->onDelete('cascade');
            $table->unsignedInteger('outage_task_id');
            $table->foreign('outage_task_id')->references('id')->on('outage_tasks')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('outage_task_server', function (Blueprint $table) {
            $table->unsignedInteger('server_id');
            $table->foreign('server_id')->references('id')->on('servers')->onDelete('cascade');
            $table->unsignedInteger('outage_task_id');
            $table->foreign('outage_task_id')->references('id')->on('outage_tasks')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('group_outage_task', function (Blueprint $table) {
            $table->unsignedInteger('group_id');
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->unsignedInteger('outage_task_id');
            $table->foreign('outage_task_id')->references('id')->on('outage_tasks')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('outage_task_person', function (Blueprint $table) {
            $table->unsignedInteger('person_id');
            $table->foreign('person_id')->references('id')->on('people')->onDelete('cascade');
            $table->unsignedInteger('outage_task_id');
            $table->foreign('outage_task_id')->references('id')->on('outage_tasks')->onDelete('cascade');
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
        Schema::table('outage_tasks', function(Blueprint $table) {
          $table->dropForeign('outage_tasks_group_id_foreign');
        });

        Schema::table('outage_outage_task', function (Blueprint $table) {
          $table->dropForeign('outage_outage_task_outage_task_id_foreign');
          $table->dropForeign('outage_outage_task_outage_id_foreign');
        });

        Schema::table('application_outage_task', function (Blueprint $table) {
          $table->dropForeign('application_outage_task_outage_task_id_foreign');
          $table->dropForeign('application_outage_task_application_id_foreign');
        });

        Schema::table('operating_system_outage_task', function (Blueprint $table) {
          $table->dropForeign('operating_system_outage_task_outage_task_id_foreign');
          $table->dropForeign('operating_system_outage_task_operating_system_id_foreign');
        });

        Schema::table('group_outage_task', function (Blueprint $table) {
          $table->dropForeign('group_outage_task_outage_task_id_foreign');
          $table->dropForeign('group_outage_task_group_id_foreign');
        });

        Schema::table('outage_task_server', function (Blueprint $table) {
          $table->dropForeign('outage_task_server_outage_task_id_foreign');
          $table->dropForeign('outage_task_server_server_id_foreign');
        });

        Schema::table('outage_task_person', function (Blueprint $table) {
          $table->dropForeign('outage_task_person_outage_task_id_foreign');
          $table->dropForeign('outage_task_person_person_id_foreign');
        });

        Schema::drop('outage_outage_task');
        Schema::drop('application_outage_task');
        Schema::drop('group_outage_task');
        Schema::drop('outage_task_server');
        Schema::drop('outage_task_person');
        Schema::drop('outage_tasks');
        Schema::drop('operating_system_outage_task');
        Schema::drop('operating_systems');
      });
    }
}
