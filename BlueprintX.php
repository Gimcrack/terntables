<?php

namespace App\Dashboard;

use Illuminate\Database\Schema\Blueprint;


class BlueprintX extends Blueprint {

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