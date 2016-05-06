<?php

namespace App\Dashboard\Monolog;

use \Monolog\Handler\AbstractProcessingHandler;
use \Monolog\Logger;
use App\Dashboard\Monolog\DashboardFormatter;
use App\LogEntry;

/**
 * Sends logs to Dashboard Database.
 *
 */
class DashboardHandler extends AbstractProcessingHandler
{
    protected $tag = array();
    
    public function __construct( $level = Logger::DEBUG, $bubble = true )
    {
        parent::__construct($level, $bubble);
    }

    public function setTag($tag)
    {
        $tag = !empty($tag) ? $tag : array();
        $this->tag = is_array($tag) ? $tag : array($tag);
    }

    public function addTag($tag)
    {
        if (!empty($tag)) {
            $tag = is_array($tag) ? $tag : array($tag);
            $this->tag = array_unique(array_merge($this->tag, $tag));
        }
    }

    protected function write(array $record)
    {
        $this->send( $record["formatted"] );
    }

    public function handleBatch(array $records)
    {
        $level = $this->level;
        $records = array_filter($records, function ($record) use ($level) {
            return ($record['level'] >= $level);
        });
        if ($records) {
            $this->sendMany( $this->getFormatter()->formatBatch($records) );
        }
    }

    protected function send($data)
    {
        LogEntry::create($data);
    }

    protected function sendMany( $array )
    {
        foreach($array as $data)
        {
            $this->send($data);
        }
    }

    protected function getDefaultFormatter()
    {
        return new DashboardFormatter();
    }
}