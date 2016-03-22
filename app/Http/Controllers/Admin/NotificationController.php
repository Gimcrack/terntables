<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RecordLock;
use Input;

class NotificationController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'admin.notifications.index'
  );

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\Notification';

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth.admin');
  }

}
