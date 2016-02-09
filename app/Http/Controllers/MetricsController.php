<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class MetricsController extends Controller
{

    /**
     * Display the tickets metrics for the specified team
     * @method tickets
     * @param  [type]  $team [description]
     * @return [type]        [description]
     */
    public function tickets( $groupOrIndividual = null, $id = null )
    {
      return view('metrics.tickets', compact('groupOrIndividual', 'id') );
    }

    /**
     * Display the tickets metrics for the specified team
     * @method tickets
     * @param  [type]  $team [description]
     * @return [type]        [description]
     */
    public function archiveTickets( $groupOrIndividual = null, $id = null, $period = "year" )
    {
      // period options
      $periods = [
        "year" => "Last 12 Months",
        "six_months" => "Last 6 Months",
        "quarter" => "Last 3 Months",
        "month" => "Last Month"
      ];

      $periodName = $periods[$period];
      return view('metrics.ticketsArchive', compact('groupOrIndividual', 'id', 'period', 'periodName'));
    }
}
