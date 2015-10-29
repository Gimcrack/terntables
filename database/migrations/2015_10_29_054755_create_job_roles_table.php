<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateJobRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobroles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('manager_flag')->default(0);
            $table->unsignedInteger('org_id'); // managing org
            $table->foreign('org_id')->references('id')->on('orgs');
            $table->unsignedInteger('manager_id')->default(0); // the manager of this role
            $table->unsignedInteger('people_id')->default(0); // roles can be unfilled
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
        Schema::table('jobroles', function(Blueprint $table) {
            $table->dropForeign('jobroles_org_id_foreign');
        });
        Schema::drop('jobroles');
    }
}
