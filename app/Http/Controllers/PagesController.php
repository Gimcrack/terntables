<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\RecordLock;
use DB;
use Auth;
use App\User;

class PagesController extends Controller
{

    /**
     * Construct a new PagesController
     * @method __construct
     */
    public function __construct()
    {
      $this->middleware('auth', ['except' => ['home','sharepoint']]);
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
     * SharePoint helper view
     * @method sharepoint
     * @return [type]     [description]
     */
    public function sharepoint()
    {
      return view('pages.sharepoint');
    }

}
