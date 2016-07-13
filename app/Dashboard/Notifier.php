<?php

namespace App\Dashboard;

use SMS;
use Mail;
use Log;
use App\LogEntry;


class Notifier {

    /**
     * Send a mail notification
     *
     * @param      string  $view     The view
     * @param      array   $data     The data
     * @param      string  $to       The to address
     * @param      string  $subject  The subject
     * @param      string  $from     The from address
     */
    public static function mail( $view, $data = [], $to = null, $subject = null, $from = "itdashboard@notifications.matsugov.us" )
    {
      $to = static::to( $to );
      $subject = static::subject( $subject );

      foreach( $to as $recipient )
      {
        Mail::send($view, $data , function($message) use ($recipient, $subject, $from) {
          $message->to($recipient)->from($from)->subject($subject);
        });
      }

    }

    /**
     * Send a text message notification
     *
     * @param      string  $number   The number
     * @param      string  $message  The message
     */
    public static function text( $number, $body )
    {
      $numbers = ( ! is_array($number) ) ? explode("\n", $number) : $number;
      
      $formatted = array_map( "Notifier::formatPhone", $numbers );

      foreach($formatted as $number)
      {
        static::sendSMS( $number, $body );  
      }
    }

    /**
     * Send the text message
     *
     * @param      <type>  $number  The number
     * @param      <type>  $body    The body
     */
    private static function sendSMS( $number, $body, $from = null )
    {
      SMS::send('sms.generic', compact('body'), function($sms) use ($number, $from) {
        $sms->to($number)->from( $from ?: env('SMS_FROM') );
      });
    }

    /**
     * Is it currently quiet hours
     * @method isQuietHours
     * @return boolean      [description]
     */
    public static function isQuietHours( $prod = true )
    {
      $env = ( !! $prod ) ? 'prod' : 'test';

      $config = ( date('N') < 6  ) ?
          config("alerts.quiet_hours.{$env}") :
          config("alerts.quiet_hours.weekend");

      return ( date('H') < $config['before'] || date('H') >= $config['after'] );
    }

    /**
     * Is there an outage happening?
     * @method isOutage
     * @return boolean  [description]
     */
    public static function isOutage()
    {
      $config = config('alerts.quiet_hours.outage');
      return ( !! \App\Outage::active()->count() && date('H') >= $config['after'] );
    }

    /**
     * Should notifications be sent now?
     * 
     * @return boolean
     */
    public static function shouldNotify(LogEntry $logEntry)
    {
      switch (true) {
        // don't notify if the server | database | etc. is inactive.
        case $logEntry->loggable->inactive_flag :

        // don't notify if there is an outage happening.
        case static::isOutage() :

        // don't notify if it is quiet hours, unless a production 
        //  server exceeds the threshold for logged events
        case static::isQuietHours( $logEntry->loggable->production_flag ) 
        && ! static::exceedsProductionThreshold($logEntry->loggable) :
          return false;
      }

      return true;
    }

    /**
     * Have the number of recent important unnotified events
     *  exceeded the threshold?
     *
     * @param      <type>  $loggable  The loggable
     *
     * @return     bool
     */
    public static function exceedsProductionThreshold($loggable)  
    {
      if ( ! $loggable->production_flag ) return false;

      return !! LogEntry::where('loggable_id',$loggable->loggable_id)
        ->unnotified()
        ->important()
        ->recent()
        ->count() >= config('alerts.production_alert_threshold');
    }


    /**
     * Format a phone number for sending a text
     * @method formatPhone
     * @param  [type]      $number [description]
     * @return [type]              [description]
     */
    public static function formatPhone($number)
    {
      switch( true )
      {
        case strlen($number) == 7 :
          $number = "+1907" . $number;
        break;

        case strlen($number) == 10 :
          $number =  "+1" . $number;
        break;

        case strlen($number) == 11 :
          $number = "+" . $number;
        break;

        case strlen($number) == 12 :
        break;

        default :
          return Log::error("{$number} is not a valid phone number");

      }

      switch( env('SMS_DRIVER') )
      {
        case 'eztexting' :
        case 'email' :
          return substr($number,2);
      }
      
      return $number;
    }

    /**
     * Format the to address
     *
     * @param      <string>  $email  The email
     * 
     * @return     <array>   The formatted emails
     */
    public static function to( $email )
    {
      return $email ? explode("\n",$email ) : explode(";",env('ADMIN_EMAIL'));
    }

    /**
     * Format the subject
     *
     * @param      <string>  $subject  The subject
     *
     * @return     <string>  The formatted subject
     */
    public static function subject( $subject )
    {
      return $subject ?: env('SITE_TITLE') . " Alert";
    }
}
