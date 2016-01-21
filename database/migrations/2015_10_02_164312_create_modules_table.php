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
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('model')->nullable();
            $table->boolean('create_enabled')->default(0);
            $table->boolean('read_enabled')->default(0);
            $table->boolean('update_enabled')->default(0);
            $table->boolean('delete_enabled')->default(0);
            $table->timestamps();
        });

        Schema::create('group_role', function( Blueprint $table) {
            $table->unsignedInteger('group_id')->index();
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->unsignedInteger('role_id')->index();
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
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
        Schema::table('group_role', function(Blueprint $table) {
            $table->dropForeign('group_role_group_id_foreign');
            $table->dropForeign('group_role_role_id_foreign');
        });

        Schema::drop('roles');
        Schema::drop('group_role');
    }
}
