<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCollectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('org_id');
            $table->foreign('org_id')->references('id')->on('orgs'); // managing orgs
            $table->timestamps();
        });

        Schema::create('collection_requirement', function( Blueprint $table) {
            $table->unsignedInteger('collection_id')->index();
            $table->foreign('collection_id')->references('id')->on('collections')->onDelete('cascade');
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
        Schema::table('collection_requirement', function(Blueprint $table) {
            $table->dropForeign('collection_requirement_collection_id_foreign');
            $table->dropForeign('collection_requirement_requirement_id_foreign');
        });

        Schema::drop('collection_requirement');

        Schema::table('collections', function(Blueprint $table) {
          $table->dropForeign('collections_org_id_foreign');
        });
        Schema::drop('collections');
    }
}
