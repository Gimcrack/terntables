<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ActiveDirectoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $users = \Adldap::users()->search()
                ->orWhere('samaccountname','=',$id)
                ->orWhere('cn','contains',$id)
                ->orWhere('title','contains',$id)
                ->orWhere('department','contains',$id)
                ->orWhere('memberof','=',$id)
                // ->orWhere('dn','=',"*")
                ->get();//->orWhere('samaccountname','=',$id)->get();


      $data = [];

      foreach($users as $user) {
          $temp = $user->jsonSerialize();
          $temp['is_active'] = $user->isActive();
          $temp['is_enabled'] = $user->isEnabled();
          $data[] = $temp;
      }

      $return = [
        "class" => "User",
        "query" => $id,
        "from" => 1,
        "to" => $users->count(),
        "total" => $users->count(),
        "data" => $data,
      ];

      return response()->json($return,200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //

    }
}
