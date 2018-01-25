<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Server;
use Input;

class UpdateDetailController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'bi.updates.approve'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\UpdateDetail';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server',
    'header'
  ];

}
