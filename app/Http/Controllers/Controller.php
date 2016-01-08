<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Tag;
use Input;
use Illuminate\Http\Request;
use App\Http\Requests;
use DB;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * The associated views
     * @var [type]
     */
    public $views;

    /**
     * The class of the model
     * @var [type]
     */
    public $model_class;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view($this->views->index);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $model_class = $this->model_class;
        $model = $model_class::find($id);

        return view('pages.history', compact('model'));
    }

}
