<?php

namespace App\Http\Controllers\Api\v1;

use Carbon;
use App\LogEntry;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\SilencedNotification;
use App\Http\Controllers\Api\v1\ApiController;

class LogEntryController extends ApiController
{

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\LogEntry';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'LogEntry';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'loggable'
  ];

  /**
   * Silence the selected logEntries for the specified amount of hours
   * @method silenceNotifications
   *
   * @return   void
   */
  public function silenceNotifications(Request $request)
  {
    $hours = $request->get('hours',null);

    if ( ! is_numeric($hours) ) 
    {
      return $this->operationFailed('Please enter a numeric value for hours.',406);
    }

    $expires = Carbon::now()->addHours( $hours );

    LogEntry::whereIn('id',$this->getInputIds())
    ->get()
    ->unique()
    ->each(function( LogEntry $logEntry ) use ( $expires ) {
      SilencedNotification::create([
        'loggable_type' => $logEntry->loggable_type,
        'loggable_id' => $logEntry->loggable_id,
        'expires_at' => $expires->format("Y-m-d\TG:i")
      ]);
    });

    return $this->operationSuccessful();
  }


}
