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
      $this->middleware('auth.superadmin');

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

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $colparams
     * @return Response
     */
    public function update(Request $request, $colparams)
    {
        $cp = ColParam::findOrFail($colparams);

        $attempt = $cp->update($request->all());

        if ($attempt) {
          return array_merge([
            'message' => 'Operation Successful!',
            'error' => false
          ], $cp->toArray() );
        } else {
          return [
            'message' => 'Operation Failed!',
            'error' => true
          ];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }



    public function tablelist()
    {

      return [
        'col_params',
        'users',
        'groups'
      ];

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
