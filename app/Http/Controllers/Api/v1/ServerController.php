<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;
use Illuminate\Foundation\Bus\DispatchesJobs;

use App\Jobs\UpdateServices;
use App\Http\Requests;
use App\Http\Controllers\Api\v1\ApiController;
use App\Server;
use App\Service;

use Input;

class ServerController extends ApiController
{
  use DispatchesJobs;

  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\Server';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'Server';


  public $limitPerPage = 200;

  /**
   * What relationships to grab with the model
   * @var [type]
   */
  public $with = [
    //'applications',
    //'databases',
    'people',
    'tags',
    'owner',
    'operating_system',
    'update_batches',
    'agent'
  ];

  /**
   * What relationships to save with the model
   * @var [type]
   */
  public $relations = [
    'people',
    'applications',
    'databases'
  ];

  /**
   * Parse the search filter
   * @method parseSearchFilter
   * @return [type]            [description]
   */
  public function parseSearchFilter()
  {
    $filter = Input::get('filter',null);

    if (empty($filter))
    {
      return '1=1';
    }

    $search = [':show__only__my__groups:'];
    $replace = [$this->showOnlyMyGroupsCriteria()];

    $filter = str_replace($search,$replace,$filter);

    return $filter;
  }

  /**
   * Get the criteria for my groups tasks
   * @method showOnlyAvailableCriteria
   * @return [type]                    [description]
   */
  private function showOnlyMyGroupsCriteria()
  {
    $my_groups = implode(",",$this->user->groups()->lists('id')->toArray() );
    return "group_id in ({$my_groups})";
  }

  /**
   * Mark servers as prod/not prod/inactive/not inactive
   * @method markServers
   * @return [type]      [description]
   */
  public function markServers()
  {
    $fillable = ['production_flag', 'inactive_flag', 'status'];
    return $this->massUpdate( $this->getInputIds(), array_intersect_key( Input::all() , array_flip( $fillable ) ) );
  }

  /**
   * Add tag to the selected servers
   * @method addTag
   *
   * @return   void
   */
  public function addTag(Request $request)
  {
      $tag = \App\Tag::firstOrCreate(['name' => $request->get('tag')]);

      Server::whereIn('id', $this->getInputIds()) 
        ->each( function(Server $server) use ($tag) {
          $tags = $server->tags()->lists('tag_id')->push($tag->id)->unique()->all();
          $server->tags()->detach();
          $server->tags()->sync($tags);
        });

      return $this->operationSuccessful();
  }

  /**
   * Remove tag from the selected servers
   * @method removeTag
   *
   * @return   void
   */
  public function removeTag(Request $request)
  {
      $tag = \App\Tag::where(['name' => $request->get('tag')])->firstOrFail();

      Server::whereIn('id', $this->getInputIds()) 
        ->each( function(Server $server) use ($tag) {
          $server->tags()->detach($tag->id);
        });

      return $this->operationSuccessful();
  }

  /**
   * Get all the servers for a health check
   * @method healthServers
   * @return [type]        [description]
   */
  public function healthServers()
  {
    $data = Server::with(['alerts' => function($query) {
      $query->unacknowledged();
    }])
      ->active()
      ->windows()
      ->get();
    return response()->json($data);
  }

  public function windowsUpdateServerIndex(Request $request)
  {

    $input = $request->all();
    $model_class = $this->model_class;

    $filter = $this->parseSearchFilter();

    $with = ['owner','operating_system'];

    $q = $request->input('q',null);
    $scope = $request->input('scope','all');

    if ( !! $q ) {
      $results = $model_class::search( $q )
                  ->with($with)
                  ->windows()
                  ->updatable( )
                  ->hasUpdates( $request->input('showUnupdatable',false) )
                  ->$scope()
                  ->whereRaw($filter)
                  ->paginate( $this->limitPerPage );
    } else {
      $results = $model_class::with($with)
                  ->windows()
                  ->updatable()
                  ->hasUpdates( $request->input('showUnupdatable',false) )
                  ->$scope()
                  ->whereRaw($filter)
                  ->paginate( $this->limitPerPage );
    }

    return response()->json( $results );
  }

  /**
   * Update the services for the selected server
   */
  public function updateServices($server_id, Request $request)
  {
    $this->dispatch( new UpdateServices( $server_id, $request ) );
      
    return $this->operationSuccessful();
  }

  /**
   * Update the status of the agent for the selected server
   * @method updateAgent
   *
   * @return   void
   */
  public function updateAgentStatus($server_id, Request $request)
  {
      $this->dispatch( new UpdateAgent( $server_id, $request ) );

      return $this->operationSuccessful();
  }

}
