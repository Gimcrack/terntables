<?php

namespace App\Dashboard;

use Twilio;
use Mail;

class Notifier {

    public static function mail( $view, $data = [], $to = null, $subject = null )
    {
      $to = $to ?: explode(";",env('ADMIN_EMAIL'));
      $subject = $subject ?: env('SITE_TITLE') . " Alert";

      Mail::send($view, $data , function($message) use ($to, $subject) {
        $message->to($to)->subject($subject);
      });
    }

    public static function text( $number, $message )
    {
      Twilio::message($number, $message);
    }
}
