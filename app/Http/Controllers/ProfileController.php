<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use Input;

class ProfileController extends Controller
{
    /**
     * The associated views
     * @var [type]
     */
    public $views = [
      'index' => 'pages.profile.index'
    ];

    /**
     * The class of the model
     * @var string
     */
    public $model_class = 'App\User';

    /**
     * What relationships to grab with the model
     * @var [type]
     */
    public $with = [
      'groups.roles',
      'person'
    ];

    /**
     * Show the user's profile view
     * @method show
     * @return [type] [description]
     */
    public function index()
    {
      return view('pages.profile.index');
    }

}
