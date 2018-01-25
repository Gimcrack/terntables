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
    * Spawn a new instance of the controller
    */
    public function __construct()
    {
        $this->views = (object) $this->views;
    }

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
     * The relationships to return with the information
     */
    public $with = [];

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
        $model = $model_class::with($this->with)->findOrFail($id);

        $attributes = $model->attributesForHumans();
        $history = $this->getHistory($model);

        $name = $model->identifiableName();

        return view('pages.inspect', compact('name','model','attributes','history'));
    }

    /**
     * Get history on the model
     * @method getHistory
     * @param  [type]     $data [description]
     * @return [type]           [description]
     */
    public function getHistory($data)
    {
      $readable_history = [];

      foreach($data->revisionHistory as $history) {
        $readable_history[] = [
          'date' => date('Y-m-d H:i', strtotime( $history->updated_at )),
          'dateForHumans' => $history->updated_at->diffForHumans(),
          'person' => @$history->userResponsible()->person->name ?: 'System',
          'description' => ( !is_null($history->old_value) ) ?
              "[{$history->fieldName()}] changed from '{$history->oldValue()}' to '{$history->newValue()}'" :
              "Record Created"
        ];
      }

      return $readable_history;

    }



}
