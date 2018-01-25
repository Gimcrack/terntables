<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ServerDisksAddInactiveFlagColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('server_disks', function (Blueprint $table) {
            $table->boolean('inactive_flag')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $this->dropDefault('server_disks', 'inactive_flag');

        Schema::table('server_disks', function (Blueprint $table) {
            $table->dropColumn('inactive_flag');
        });
    }

    /**
     * Drop a column
     * @method dropColumn
     *
     * @return   void
     */
    public function dropDefault($table, $column)
    {
        DB::statement("   
            DECLARE @ObjectName NVARCHAR(100);
            SELECT @ObjectName = OBJECT_NAME([default_object_id]) 
            FROM SYS.COLUMNS 
            WHERE [object_id] = OBJECT_ID('dbo.{$table}') 
                AND [name] = '{$column}';

            IF @ObjectName IS NOT NULL
                EXEC('ALTER TABLE dbo.{$table} DROP CONSTRAINT ' + @ObjectName)
        ");
    }
}
