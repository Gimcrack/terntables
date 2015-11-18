<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResourcesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->string('type')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('org_id');
            $table->foreign('org_id')->references('id')->on('orgs'); // managing orgs
            $table->timestamps();
        });

        Schema::create('collection_resource', function( Blueprint $table) {
            $table->unsignedInteger('collection_id')->index();
            $table->foreign('collection_id')->references('id')->on('collections')->onDelete('cascade');
            $table->unsignedInteger('resource_id')->index();
            $table->foreign('resource_id')->references('id')->on('resources')->onDelete('cascade');
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
        Schema::table('collection_resource', function(Blueprint $table) {
            $table->dropForeign('collection_resource_collection_id_foreign');
            $table->dropForeign('collection_resource_resource_id_foreign');
        });

        Schema::drop('collection_resource');

        Schema::table('resources', function(Blueprint $table) {
          $table->dropForeign('resources_org_id_foreign');
        });

        Schema::drop('resources');
    }
}
