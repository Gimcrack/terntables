<?php

namespace App\Dashboard\Monolog;

/**
 * Encodes message information into JSON in a format compatible with Laravelocity.
 *
 */
class DashboardFormatter
{
    /**
     * Format the record
     *
     * @see https://www.loggly.com/docs/automated-parsing/#json
     * @see \Monolog\Formatter\JsonFormatter::format()
     */
    public function format(array $record)
    {
   		$record['user_id'] = isset($record['user_id']) ? $record['user_id'] : 1;
        $record['context'] = json_encode($record['context']);
        $record['extra'] = json_encode($record['extra']);
        $record['reported_at'] = date('Y-m-d H:i:s');
        $record['loggable_id'] = \App\Application::where('name','IT Dashboard')->first()->id;
        $record['loggable_type'] = 'App\Application';
        return $record;
    }
}