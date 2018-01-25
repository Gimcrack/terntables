<?php

namespace App\Dashboard;

use App\LogEntry;
use App\Events\ImportantEventLogged;
use Event;

class Logger {

    /**
     * Detailed debug information
     */
    const DEBUG = 100;

    /**
     * Interesting events
     *
     * Examples: User logs in, SQL logs.
     */
    const INFO = 200;

    /**
     * Uncommon events
     */
    const NOTICE = 250;

    /**
     * Exceptional occurrences that are not errors
     *
     * Examples: Use of deprecated APIs, poor use of an API,
     * undesirable things that are not necessarily wrong.
     */
    const WARNING = 300;

    /**
     * Runtime errors
     */
    const ERROR = 400;

    /**
     * Critical conditions
     *
     * Example: Application component unavailable, unexpected exception.
     */
    const CRITICAL = 500;

    /**
     * Action must be taken immediately
     *
     * Example: Entire website down, database unavailable, etc.
     * This should trigger the SMS alerts and wake you up.
     */
    const ALERT = 550;

    /**
     * Urgent alert.
     */
    const EMERGENCY = 600;

    /**
     * Logging levels from syslog protocol defined in RFC 5424
     *
     * @var array $levels Logging levels
     */
    protected static $levels = [
        self::DEBUG     => 'DEBUG',
        self::INFO      => 'INFO',
        self::NOTICE    => 'NOTICE',
        self::WARNING   => 'WARNING',
        self::ERROR     => 'ERROR',
        self::CRITICAL  => 'CRITICAL',
        self::ALERT     => 'ALERT',
        self::EMERGENCY => 'EMERGENCY',
    ];
        
    /**
     * Log a debug message
     *
     * @param      <type>  $message  The message
     * @param      array   $context  The context
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public static function debug($message, $loggable_type = null, $loggable_id = null, $context = [])
    {
        return static::log( static::DEBUG, $message, $loggable_type, $loggable_id, $context );
    }

    /**
     * Log a info message
     *
     * @param      <type>  $message  The message
     * @param      array   $context  The context
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public static function info($message, $loggable_type = null, $loggable_id = null, $context = [])
    {
        return static::log( static::INFO, $message, $loggable_type, $loggable_id, $context );
    }

    /**
     * Log a notice message
     *
     * @param      <type>  $message  The message
     * @param      array   $context  The context
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public static function notice($message, $loggable_type = null, $loggable_id = null, $context = [])
    {
        return static::log( static::NOTICE, $message, $loggable_type, $loggable_id, $context );
    }

    /**
     * Log a warning message
     *
     * @param      <type>  $message  The message
     * @param      array   $context  The context
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public static function warning($message, $loggable_type = null, $loggable_id = null, $context = [])
    {
        return static::log( static::WARNING, $message, $loggable_type, $loggable_id, $context );
    }

    /**
     * Log a error message
     *
     * @param      <type>  $message  The message
     * @param      array   $context  The context
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public static function error($message, $loggable_type = null, $loggable_id = null, $context = [])
    {
        return static::log( static::ERROR, $message, $loggable_type, $loggable_id, $context );
    }

    /**
     * Log a critical message
     *
     * @param      <type>  $message  The message
     * @param      array   $context  The context
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public static function critical($message, $loggable_type = null, $loggable_id = null, $context = [])
    {
        $entry = static::log( static::CRITICAL, $message, $loggable_type, $loggable_id, $context );
        Event::fire( new ImportantEventLogged($entry) );
        return $entry;
    }

    /**
     * Log a alert message
     *
     * @param      <type>  $message  The message
     * @param      array   $context  The context
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public static function alert($message, $loggable_type = null, $loggable_id = null, $context = [])
    {
        $entry = static::log( static::ALERT, $message, $loggable_type, $loggable_id, $context );
        Event::fire( new ImportantEventLogged($entry) );
        return $entry;

    }

    /**
     * Log a emergency message
     *
     * @param      <type>  $message  The message
     * @param      array   $context  The context
     *
     * @return     <type>  ( description_of_the_return_value )
     */
    public static function emergency($message, $loggable_type = null, $loggable_id = null, $context = [])
    {
        $entry = static::log( static::EMERGENCY, $message, $loggable_type, $loggable_id, $context );
        Event::fire( new ImportantEventLogged($entry) );
        return $entry;
    }


    /**
     * Log a message
     *
     * @param      string  $level    The level
     * @param      string  $message  The message
     * @param      array   $context  The context
     * 
     * @return     LogEntry The created Log Entry
     */
    private static function log( $level, $message, $loggable_type, $loggable_id, $context ) {

        return LogEntry::create([
            'user_id' => 1,
            'message' => (string) $message,
            'context' => json_encode($context),
            'level' => $level,
            'level_name' => static::getLevelName($level),
            'channel' => 'dashboard',
            'extra' => '[]',
            'reported_at' => date('Y-m-d H:i:s'),
            'loggable_id' => $loggable_id,
            'loggable_type' => $loggable_type
        ]);

    }

    /**
     * Gets the name of the logging level.
     *
     * @param  int    $level
     * @return string
     */
    public static function getLevelName($level)
    {
        if (!isset(static::$levels[$level])) {
            throw new InvalidArgumentException('Level "'.$level.'" is not defined, use one of: '.implode(', ', array_keys(static::$levels)));
        }

        return static::$levels[$level];
    }
}