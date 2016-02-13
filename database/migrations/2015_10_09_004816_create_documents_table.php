<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('status')->default('processing');
            $table->text('raw_file_path');
            $table->text('parsed_file_path');
            $table->unsignedInteger('people_id')->nullable();
            $table->foreign('people_id')->references('id')->on('people')->onDelete('set null');
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
      DB::statement('EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"');
        // Schema::table('documents', function(Blueprint $table) {
        //     $table->dropForeign('documents_people_id_foreign');
        // });
        Schema::drop('documents');
    }
}
