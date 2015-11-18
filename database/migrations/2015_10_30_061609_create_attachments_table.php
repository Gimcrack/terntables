<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attachments', function (Blueprint $table) {
          $table->increments('id');
          $table->string('name');
          $table->string('filepath');
          $table->text('description')->nullable();
          $table->unsignedInteger('resource_id');
          $table->foreign('resource_id')->references('id')->on('resources')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('attachments', function(Blueprint $table) {
          $table->dropForeign('attachments_resource_id_foreign');
      });

      Schema::drop('attachments');
    }
}
