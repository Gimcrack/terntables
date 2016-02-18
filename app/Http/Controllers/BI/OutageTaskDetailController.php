<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Outage;

class OutageTaskDetailController extends Controller
{
  /**
   * The associated views
   * @var [type]
   */
  public $views = array(
    'index' => 'bi.outages.taskDetails'
  );

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\OutageTaskDetail';

  public $with = [
    'owner',
    'assignee',
    'outage',
    'server',
    'application',
    'database',
    'outage_task'
  ];

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->views = (object) $this->views;
    $this->middleware('auth');
  }

  /**
   * Generate task details for pending outages
   * @method generateTaskDetails
   * @return [type]              [description]
   */
  public function generateTaskDetails()
  {
    Outage::generateAllTaskDetails();

    return redirect('/bi/outageTasks');
  }
}
