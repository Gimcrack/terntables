<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateModulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->boolean('create_enabled')->default(0);
            $table->boolean('read_enabled')->default(0);
            $table->boolean('update_enabled')->default(0);
            $table->boolean('delete_enabled')->default(0);
            $table->timestamps();
        });

        Schema::create('group_module', function( Blueprint $table) {
            $table->unsignedInteger('group_id')->index();
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->unsignedInteger('module_id')->index();
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
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
        Schema::table('group_module', function(Blueprint $table) {
            $table->dropForeign('group_module_group_id_foreign');
            $table->dropForeign('group_module_module_id_foreign');
        });

        Schema::drop('modules');
        Schema::drop('group_module');
    }
}
