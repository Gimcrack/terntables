<?php

return [

    /**
     *
     * Alerts will not be sent during quiet hours unless
     * 	- A production object has reached the threshold for alerts within 1 hour
     *
     */

    'production_alert_threshold' => 3,

    'quiet_hours' => [

      'test' => [
        'before' => 8,
        'after' => 17
      ],

      'prod' => [
        'before' => 6,
        'after' => 20
      ],

      'weekend' => [
        'before' => 24,
        'after' => 0
      ],

      'outage' => [
        'after' => 18
      ],

    ],



];
