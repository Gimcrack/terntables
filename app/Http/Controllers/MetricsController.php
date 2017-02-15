<?php

namespace App\Http\Controllers;

use Cache;
use Illuminate\Http\Request;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\BadResponseException;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class MetricsController extends Controller
{
    /**
     * The http client
     * @var \GuzzleHttp\Client;
     */
    protected $client;

    /**
     * The base url of the api
     * @var string
     */
    protected $api_base = 'https://isupport.matsugov.us/Api/v14-5/Incident/';

    /**
     * Make a new Intrinio handler class
     */
    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => $this->api_base,
        ]);
    }


    /**
     * Perform a get request for the specific endpoint
     * @return \Response
     */
    public function get($endpoint, $params = [])
    {

        try {
            return $this->client->request(
                'GET',
                $endpoint,
                [
                    'query' => $params
                ]
            );
        } catch (ClientException $e) {
            
        } catch (ServerException $e) {
            
        } catch (BadResponseException $e) {
            
        } catch( ConnectException $e ) {
            
        }
    }

    /**
     * Perform a get request and return the response body as JSON
     *
     * @param  [type] $endpoint [description]
     * @param  array  $params   [description]
     * @return [type]           [description]
     */
    public function getJSON($endpoint, $params = [])
    {
        $cache_key = collect( compact('endpoint','params') )->toJson();

        return Cache::remember( $cache_key, 60 * 24, function() use ($endpoint, $params) {

            $data = [
                'errors' => false,
                'endpoint' => $endpoint,
                'params' => $params,
            ];

            return json_decode($this->get($endpoint, $params)->getBody(), true);

            // if (! is_array($result)) {
            //     return $this->respondWithError();
            // }
            
            // if ( ! isset($result['data']) || ! is_array($result['data']) )
            // {
            //     $data += ['data' => [$result] ];
            // }
            // else
            // {
            //     $data += $result;
            // }

            // return $data;

        });
    }

    /**
     * Get the tickets in json from the isupport api
     * @method tickets_json
     *
     * @return   json response
     */
    public function tickets_json( $groupOrIndividual = null, $id = null, $archive = false)
    {
        $data = ( $archive ) ?
          $this->getJSON("Archive/{$groupOrIndividual}/{$id}") :
          $this->getJSON("{$groupOrIndividual}/{$id}");
        

        return response()->json($data);
    } 

    /**
     * Get the tickets in json from the isupport api
     * @method tickets_json
     *
     * @return   json response
     */
    public function tickets_json_archive( $groupOrIndividual = null, $id = null)
    {
      return $this->tickets_json($groupOrIndividual,$id,$archive = true);           
    }
    

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
