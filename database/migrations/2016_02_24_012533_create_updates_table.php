<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUpdatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('updates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title')->unique();
            $table->text('description')->nullable();
            $table->string('kb_article');
            $table->timestamps();
        });

        Schema::create('update_details', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('update_id');
            $table->unsignedInteger('server_id');
            $table->boolean('eula_accepted')->default(0);
            $table->boolean('downloaded_flag')->default(0);
            $table->boolean('hidden_flag')->default(0);
            $table->boolean('installed_flag')->default(0);
            $table->boolean('mandatory_flag')->default(0);
            $table->boolean('approved_flag')->default(0);
            $table->unsignedInteger('max_download_size')->default(0);
            $table->unsignedInteger('min_download_size')->default(0);
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
        Schema::drop('updates');
        Schema::drop('update_details');
    }
}
