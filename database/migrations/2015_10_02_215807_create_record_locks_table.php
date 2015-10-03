<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecordLocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     *
     *
     * @return void
     */
    public function up()
    {
        Schema::create('record_locks', function (Blueprint $table) {
            $table->increments('id');
            $table->morphs('lockable');
            $table->unique(['lockable_id','lockable_type']);
            $table->integer('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::drop('record_locks');
    }
}
