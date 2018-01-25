<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use Input;
use Exception;
use App\Document;
use App\Events\DocumentWasUploaded;
use Session;
use Storage;
use Event;

class DocumentController extends ApiController
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Document';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Document';

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    'owner'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [];

  /**
   * Store the uploaded file.
   * @method storeFile
   * @param  Request   $request [description]
   * @return [type]             [description]
   */
  public function storeFile(Request $request)
  {
    $time = time();
    $file = $request->file('original_file');
    $file_original_name = str_replace(".","_",$file->getClientOriginalName() );

    $file_temp_name = "{$time}_{$file_original_name}_raw.xml";
    $file_temp_path = storage_path() . DIRECTORY_SEPARATOR . "temp";

    $file->move($file_temp_path, $file_temp_name);

    Session::put('file_original_name',$file_original_name);
    Session::put('file_temp_name',$file_temp_name);
    Session::put('file_temp_path',$file_temp_path);

    return $this->operationSuccessful('File Uploaded Successfully!');
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
    if ( $request->hasFile('original_file') && ( !$request->file('original_file')->isValid() || $request->file('original_file')->getClientMimeType() !== 'text/xml' ) ) {
      throw new Exception('Please upload a valid xml document.');
    }

    if ( $request->hasFile('original_file') ) {
      return $this->storeFile($request);
    }

    if ( ! $file_original_name = Session::get('file_original_name') ) {
      throw new Exception('Please upload a valid xml document.');
    }

    //create the document record
    $input = Input::all();
    $input['raw_file_path'] = 'placeholder';
    $input['parsed_file_path'] = 'placeholder';

    $document = Document::create($input);
    if (!empty($input['tags'][0])) {
      Tag::resolveTags( $document, explode(',',$input['tags'][0]) );
    }

    // get the file
    $file_temp_name = Session::get('file_temp_name');
    $file_temp_path = ".." . DIRECTORY_SEPARATOR . "temp";
    $file_temp = $file_temp_path . DIRECTORY_SEPARATOR . $file_temp_name;

    $file_new_name = "{$document->id}_{$file_original_name}_raw.xml";
    $file_new_name_p = "{$document->id}_{$file_original_name}_parsed.pdf";
    $file_new_path = ".." . DIRECTORY_SEPARATOR . "documents";
    $file_new = $file_new_path . DIRECTORY_SEPARATOR . $file_new_name;

    Storage::move($file_temp,$file_new);

    // update the document
    $document->update(['raw_file_path' => $file_new_name, 'parsed_file_path' => $file_new_name_p]);
    Event::fire(new DocumentWasUploaded($document) );

    Session::pull('file_original_name');
    Session::pull('file_temp_name');
    Session::pull('file_temp_path');

    return $this->operationSuccessful();
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

    if ( $request->hasFile('original_file') ) {
      return $this->storeFile($request);
    }

    $input = Input::all();

    $document = Document::find($documents);
    $document->update($input);


    if (!empty($input['tags'][0])) {
      Tag::resolveTags( $document, explode(',',$input['tags'][0]) );
    }

    if ( $file_original_name = Session::get('file_original_name') ) {
      // get the file
      $file_temp_name = Session::get('file_temp_name');
      $file_temp_path = ".." . DIRECTORY_SEPARATOR . "temp";
      $file_temp = $file_temp_path . DIRECTORY_SEPARATOR . $file_temp_name;

      $file_new_name = "{$document->id}_{$file_original_name}_raw.xml";
      $file_new_name_p = "{$document->id}_{$file_original_name}_parsed.pdf";
      $file_new_path = ".." . DIRECTORY_SEPARATOR . "documents";
      $file_new = $file_new_path . DIRECTORY_SEPARATOR . $file_new_name;

      Storage::move($file_temp,$file_new);

      // update the document
      $document->update(['raw_file_path' => $file_new_name, 'parsed_file_path' => $file_new_name_p]);
      Event::fire(new DocumentWasUploaded($document) );

      Session::pull('file_original_name');
      Session::pull('file_temp_name');
      Session::pull('file_temp_path');
    }

    return $this->operationSuccessful();
  }
}
