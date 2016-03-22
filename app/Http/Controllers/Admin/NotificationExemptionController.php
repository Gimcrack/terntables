<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RecordLock;
use Input;

class NotificationExemptionController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'admin.notifications.exemptions'
  );

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\NotificationExemption';

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth.admin');
  }

}
