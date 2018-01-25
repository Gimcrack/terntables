<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Input;

class SilencedNotificationController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'admin.notifications.silenced'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\SilencedNotification';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'loggable'
  ];

}
