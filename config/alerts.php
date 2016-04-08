<?php

return [

    /**
     *
     * Alerts will not be sent during quiet hours unless
     * 	- A production object has reached the threshold for unsent alerts
     *
     */
    'quiet_hours' => [

      'weekday' => [
        'before' => 8,
        'after' => 20
      ],

      'weekend' => [
        'before' => 24,
        'after' => 0
      ],


    ],

    'production_alert_threshold' => 3

];
