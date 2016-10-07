<?php

namespace App\Http\Controllers\BI;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Input;

class ServerServiceController extends Controller
{

  /**
   * The associated views
   * @var [type]
   */
  public $views = [
    'index' => 'bi.servers.services'
  ];

  /**
   * The class of the model
   * @var string
   */
  public $model_class = 'App\ServerService';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'server',
    'service'
  ];

}
