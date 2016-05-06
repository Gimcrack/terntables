<?php

namespace App\Dashboard;

use Twilio;
use Mail;
use Log;

class Notifier {

    public static function mail( $view, $data = [], $to = null, $subject = null, $from = "itdashboard@msb.matsugov.lan" )
    {
      $to = $to ? explode("\n",$to ) : explode(";",env('ADMIN_EMAIL'));
      $subject = $subject ?: env('SITE_TITLE') . " Alert";

      foreach( $to as $recipient )
      {
        Mail::send($view, $data , function($message) use ($recipient, $subject, $from) {
          $message->to($recipient)->from($from)->subject($subject);
        });
      }

    }

    /**
     * Send a text message
     * @method text
     * @param  [type] $number  [description]
     * @param  [type] $message [description]
     * @return [type]          [description]
     */
    public static function text( $number, $message )
    {
      $numbers = explode("\n",$number);
      foreach($numbers as $num)
      {
        try {
          Twilio::message( static::formatPhone($num) , $message);
        }

        catch( \Exception $e )
        {
          Log::error($e->getMessage());
        }

      }

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
          return "+1907" . $number;

        case strlen($number) == 10 :
          return "+1" . $number;

        case strlen($number) == 11 :
          return "+" . $number;

        case strlen($number) == 12;
          return $number;
      }

      return Log::error("{$number} is not a valid phone number");

    }
}
