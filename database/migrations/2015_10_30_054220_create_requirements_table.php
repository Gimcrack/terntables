<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRequirementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requirements', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('org_id');
            $table->foreign('org_id')->references('id')->on('orgs'); // managing orgs
            $table->timestamps();
        });

        Schema::create('jobrole_requirement', function( Blueprint $table) {
            $table->unsignedInteger('jobrole_id')->index();
            $table->foreign('jobrole_id')->references('id')->on('jobroles')->onDelete('cascade');
            $table->unsignedInteger('requirement_id')->index();
            $table->foreign('requirement_id')->references('id')->on('requirements')->onDelete('cascade');
            $table->text('comment')->nullable();
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
        Schema::table('requirements', function(Blueprint $table) {
          $table->dropForeign('requirements_org_id_foreign');
        });

        Schema::table('jobrole_requirement', function(Blueprint $table) {
            $table->dropForeign('jobrole_requirement_jobrole_id_foreign');
            $table->dropForeign('jobrole_requirement_requirement_id_foreign');
        });

        Schema::drop('requirements');
        Schema::drop('jobrole_requirement');
    }
}
