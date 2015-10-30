<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\ColParam;

class ColParamController extends Controller
{

    /**
     * Construct a new instance of the Controller
     *
     */
    public function __construct()
    {
      $this->middleware('auth.superadmin', ['except' => ['tablejson','columnjson'] ]);

    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return ColParam::all();
    }

    public function indexjson()
    {
      return ColParam::all();
    }

    public function tablejson($table)
    {
      return ColParam::where('tableName',$table)->get();
    }

    public function columnjson($table,$column)
    {
      return ColParam::where('tableName',$table)->where('name',$column)->get();
    }


}
