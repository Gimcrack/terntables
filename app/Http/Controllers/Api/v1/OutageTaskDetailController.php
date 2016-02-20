<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Input;

class OutageTaskDetailController extends ApiController
{
  /**
   * The class name of the associated model
   * @var string
   */
  public $model_class = 'App\OutageTaskDetail';

  /**
   * [$model_short description]
   * @var string
   */
  public $model_short = 'OutageTaskDetail';


  public $with = [
    'owner',
    'assignee',
    'outage',
    'server',
    'application',
    'database',
    'outage_task'
  ];

  /**
   * Parse the search filter
   * @method parseSearchFilter
   * @return [type]            [description]
   */
  public function parseSearchFilter()
  {
    $filter = Input::get('filter',null);

    $search = [':user__person__id:',':show__only__available:',':show__only__my__groups:'];
    $replace = [\Auth::user()->person->id, $this->showOnlyAvailableCriteria(), $this->showOnlyMyGroupsCriteria()];

    $filter = str_replace($search,$replace,$filter);

    return $filter;
  }

  /**
   * Get the criteria for available tasks
   * @method showOnlyAvailableCriteria
   * @return [type]                    [description]
   */
  private function showOnlyAvailableCriteria()
  {
    $my_groups = implode(",",\Auth::user()->groups()->lists('id')->toArray() );

    $ret = [];
    $ret[] = 'person_id is null';
    $ret[] = "group_id in ({$my_groups})";

    return implode(" AND ", $ret);
  }

  /**
   * Get the criteria for my groups tasks
   * @method showOnlyAvailableCriteria
   * @return [type]                    [description]
   */
  private function showOnlyMyGroupsCriteria()
  {
    $my_groups = implode(",",\Auth::user()->groups()->lists('id')->toArray() );
    return "group_id in ({$my_groups})";
  }

  /**
   * Spawn a new instance of the controller
   */
  public function __construct()
  {
    $this->middleware('auth');
  }

  /**
   * Mark the selected outage tasks
   * @method markOutageTasks
   * @return [type]          [description]
   */
  public function markOutageTasks()
  {
    $fillable = ['status','person_id'];

    $atts = array_intersect_key( Input::all() , array_flip( $fillable ) );

    if (isset( $atts['person_id'] )) {
      $atts['person_id'] = ( $atts['person_id'] === ':user__person__id:' ) ?
        \Auth::user()->person->id : $atts['person_id'] ;
    }
    return $this->massUpdate( $this->getInputIds(), $atts );
  }
}
