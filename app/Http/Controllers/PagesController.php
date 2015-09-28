<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PagesController extends Controller
{

    /**
     * Construct a new PagesController
     * @method __construct
     */
    public function __construct()
    {
      //$this->middleware('auth');

    }

    /**
     * The home view
     * @method home
     * @return /View
     */
    public function home()
    {
      return view('pages.home');

    }

    /**
     * Get select options for a model
     * @param  [type] $model   [description]
     * @param  [type] $options [description]
     * @param  [type] $labels  [description]
     * @return [type]          [description]
     */
    public function optionsjson($model,$options,$labels = [])
    {
      $class = "\\App\\{$model}";
      if (empty($labels)) { $labels = $options; }
      
      return $class::select("{$options} as option","{$labels} as label")->orderBy("{$labels}","ASC")->get();
    }
}
