<?php

namespace App\Http\Controllers;

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
     * Spawn a new instance of the controller
     */
    public function __construct()
    {
      $this->middleware('auth');
      $this->middleware('checkaccess:Document.read');
      $this->middleware('checkaccess:Document.create',['only' => 'store']);
      $this->middleware('checkaccess:Document.update',['only' => 'showjson,update']);
      $this->middleware('checkaccess:Document.delete',['only' => 'destroy,destroyMany']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('documents.index');
    }

    /**
     * Display a listing of the resource in JSON format.
     *
     * @return Response
     */
    public function indexjson()
    {
        return Document::with(['tags','owner'])->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      // check that the file is valid
      if ( !$request->hasFile('original_file') || !$request->file('original_file')->isValid() || $request->file('original_file')->getClientMimeType() !== 'text/xml' ) {
        throw new Exception('Please upload a valid xml document.');
      }

      // get the file
      $file = $request->file('original_file');
      $file_original_name = $file->getClientOriginalName();
      $file_original_extention = $file->getClientOriginalExtension();

      //create the document record
      $input = Input::all();
      $input['raw_file_path'] = 'placeholder';
      $input['parsed_file_path'] = 'placeholder';

      $document = Document::create($input);
      if (!empty($input['tags'][0])) {
        Tag::resolveTags( $document, explode(',',$input['tags'][0]) );
      }

      $file_new_name = "{$document->id}_{$file_original_name}_raw.xml";
      $file_new_name_p = "{$document->id}_{$file_original_name}_parsed.pdf";

      $file_new_path = storage_path() . DIRECTORY_SEPARATOR . "documents";

      $file->move($file_new_path, $file_new_name);
      $document->update(['raw_file_path' => $file_new_name, 'parsed_file_path' => $file_new_name_p]);
      Event::fire(new DocumentWasUploaded($document) );

      return $this->operationSuccessful();
    }

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
        $replace = [
          'pubDate' => 'Date Published',
        ];

        return view('documents.show',compact('document', 'params', 'replace') );
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

    /**
     * Display the specified resource in JSON format.
     *
     * @param  int  $id
     * @return Response
     */
    public function showjson($id)
    {
        return Document::with(['tags','owner'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $documents)
    {
      // check that the file is valid
      if ( $request->hasFile('original_file') && ( !$request->file('original_file')->isValid() || $request->file('original_file')->getClientMimeType() !== 'text/xml' ) ) {
        throw new Exception('Please upload a valid xml document.');
      }

      $input = Input::all();

      $document = Document::find($documents);
      $document->update($input);


      if (!empty($input['tags'][0])) {
        Tag::resolveTags( $document, explode(',',$input['tags'][0]) );
      }

      if ($request->hasFile('original_file')) {
        // get the file
        $file = $request->file('original_file');
        $file_original_name = $file->getClientOriginalName();
        $file_original_extention = $file->getClientOriginalExtension();

        $file_new_name = "{$document->id}_{$file_original_name}_raw.xml";
        $file_new_name_p = "{$document->id}_{$file_original_name}_parsed.xml";
        $file_new_path = storage_path() . DIRECTORY_SEPARATOR . "documents";

        $file->move($file_new_path, $file_new_name);
        $document->update(['raw_file_path' => $file_new_name, 'parsed_file_path' => $file_new_name_p]);
        Event::fire(new DocumentWasUploaded($document) );
      }

      return $this->operationSuccessful();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($documents)
    {
      Document::find($documents)->delete();
      return $this->operationSuccessful();
    }

    /**
     * Remove the specified resources from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroyMany()
    {
      $input = Input::all();
      Document::whereIn('id',$input['ids'])->delete();
      return $this->operationSuccessful();
    }
}
