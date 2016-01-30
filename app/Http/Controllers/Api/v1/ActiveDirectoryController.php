<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Adldap\Contracts\Adldap;

class ActiveDirectoryController extends Controller
{
    protected $adldap;


    public function __construct(Adldap $adldap)
    {
      $this->adldap = $adldap;
    }


    public function index()
    {
      $results = $this->adldap->users()->all();
      return response()->json( $results );
    }
}
