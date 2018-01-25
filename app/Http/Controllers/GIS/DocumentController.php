<?php

namespace App\Http\Controllers\GIS;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App;
use Response;
use App\Document;
use App\Tag;
use Input;
use Exception;
use Event;
use App\Events\DocumentWasUploaded;
use Barryvdh\DomPDF\Facade as PDF;

class DocumentController extends Controller
{
    /**
     * The associated views
     * @var [type]
     */
    public $views = [
        'index' => 'gis.documents.index'
    ];

    public $with = [
        'owner'
    ];

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $document = Document::find($id);
        $params = $document->parse();
        $replace = Document::$replace;

        return view('gis.documents.show',compact('document', 'params', 'replace') );
    }

    /**
     * Download the current document as a pdf
     * @method showpdf
     * @param  [type]  $id [description]
     * @return [type]      [description]
     */
    public function showpdf($id)
    {
        $document = Document::find($id);
        return Response::download( storage_path('documents') . DIRECTORY_SEPARATOR . $document->parsed_file_path );
    }

    /**
     * Download the current document as a raw file
     * @method showpdf
     * @param  [type]  $id [description]
     * @return [type]      [description]
     */
    public function showraw($id)
    {
        $document = Document::find($id);
        return Response::download( storage_path('documents') . DIRECTORY_SEPARATOR . $document->raw_file_path );
    }
}
