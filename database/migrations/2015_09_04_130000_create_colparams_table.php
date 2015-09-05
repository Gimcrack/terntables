<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateColParamsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('col_params', function (Blueprint $table) {
            $table->increments('colparam_id');

            $table->string('tableName');
            $table->string('name');
            $table->string('_label')->nullable();
            $table->boolean('_enabled')->default(1);
            $table->string('type');
            $table->string('value');
            $table->string('id')->nullable();
            $table->string('placeholder')->nullable();
            $table->string('class')->nullable();
            $table->string('onClick')->nullable();
            $table->string('onChange')->nullable();

            $table->string('data-validType')->nullable();
            $table->string('data-validType-template')->nullable();
            $table->string('data-ordering')->nullable();
            $table->string('data-fieldset')->nullable();
            $table->string('data-viewName')->nullable();

            $table->string('accept')->nullable();
            $table->string('alt')->nullable();
            $table->string('src')->nullable();
            $table->string('list')->nullable();
            $table->string('pattern')->nullable();
            $table->string('wrap')->nullable();

            $table->boolean('autocomplete')->default(0);
            $table->boolean('autofocus')->default(0);
            $table->boolean('checked')->default(0);
            $table->boolean('disabled')->default(0);
            $table->boolean('multiple')->default(0);
            $table->boolean('readonly')->default(0);
            $table->boolean('required')->default(0);

            $table->smallInteger('size')->nullable();
            $table->smallInteger('maxlength')->nullable();
            $table->smallInteger('cols')->nullable();
            $table->smallInteger('rows')->nullable();
            $table->smallInteger('height')->nullable();
            $table->smallInteger('width')->nullable();
            $table->string('max')->nullable();
            $table->string('min')->nullable();
            $table->decimal('step', 10, 6)->nullable();

            $table->string('_firstlabel')->nullable();
            $table->string('_firstoption')->nullable();
            $table->string('_labelssource')->nullable();
            $table->string('_optionssource')->nullable();

            $table->string('_linkedElementID')->nullable();
            $table->string('_linkedElementOptions')->nullable();
            $table->string('_linkedElementLabels')->nullable();
            $table->string('_linkedElementFilterCol')->nullable();

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
        Schema::drop('col_params');
    }
}
