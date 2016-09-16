<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogEntriesView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("
            
            CREATE VIEW vw_log_entries
            AS

            SELECT  T1.message
                  , T1.level
                  , T1.level_name
                  , T1.channel
                  , T1.loggable_id
                  , T1.loggable_type
                  , T1.loggable_name
                  , T1.group_id
                  , MAX(T1.reported_at) AS reported_at
                  , MAX(T1.notified_at) AS notified_at
                  , MAX(T1.id) AS id
                  , COUNT(message) AS entry_count
            
            
            FROM (

                SELECT 
                  LE.id
                , LE.message
                , LE.level
                , LE.level_name
                , LE.channel
                , LE.reported_at
                , LE.loggable_id
                , LE.loggable_type

                , CASE LE.loggable_type
                    WHEN 'App\Application' THEN A.name
                    WHEN 'App\Server' THEN S.name
                    WHEN 'App\ServerAgent' THEN SAS.name + ':Agent'
                    WHEN 'App\ServerDisk' THEN SDS.name + ':' + SD.name
                    WHEN 'App\ServerService' THEN SSSS.name + ':' + SSS.name
                END AS loggable_name

                , CASE LE.loggable_type
                    WHEN 'App\Application' THEN A.group_id
                    WHEN 'App\Server' THEN S.group_id
                    WHEN 'App\ServerAgent' THEN SAS.group_id
                    WHEN 'App\ServerDisk' THEN SDS.group_id
                    WHEN 'App\ServerService' THEN SSSS.group_id
                END AS group_id

                , LE.notified_at


                FROM log_entries AS LE

                LEFT JOIN applications AS A
                ON LE.loggable_type = 'App\Application'
                AND LE.loggable_id = A.id

                LEFT JOIN servers AS S
                ON LE.loggable_type = 'App\Server'
                AND LE.loggable_id = S.id

                LEFT JOIN server_agents AS SA
                ON LE.loggable_type = 'App\ServerAgent'
                AND LE.loggable_id = SA.id

                LEFT JOIN servers AS SAS
                ON LE.loggable_type = 'App\ServerAgent'
                AND LE.loggable_id = SA.id
                AND SAS.id = SA.server_id

                LEFT JOIN server_disks AS SD
                ON LE.loggable_type = 'App\ServerDisk'
                AND LE.loggable_id = SD.id

                LEFT JOIN servers AS SDS
                ON LE.loggable_type = 'App\ServerDisk'
                AND LE.loggable_id = SD.id
                AND SDS.id = SD.server_id

                LEFT JOIN server_service AS SS
                ON LE.loggable_type = 'App\ServerService'
                AND LE.loggable_id = SS.id

                LEFT JOIN services AS SSS
                ON LE.loggable_type = 'App\ServerService'
                AND LE.loggable_id = SS.id
                AND SSS.id = SS.service_id

                LEFT JOIN servers AS SSSS
                ON LE.loggable_type = 'App\ServerService'
                AND LE.loggable_id = SS.id
                AND SSSS.id = SS.server_id
            ) AS T1

            GROUP BY T1.message
                  , T1.level
                  , T1.level_name
                  , T1.channel
                  , T1.loggable_id
                  , T1.loggable_type
                  , T1.loggable_name
                  , T1.group_id
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('DROP VIEW vw_log_entries');
    }
}
