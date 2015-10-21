<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * The operation was a success
     * @method operationSuccessful
     * @return [type]              [description]
     */
    public function operationSuccessful()
    {
      return [
        "errors" => false,
        "message" => "Operation Completed Successfully"
      ];
    }

    /**
     * The operation failed
     * @method operationFailed
     * @param  [type]          $e [description]
     * @return [type]             [description]
     */
    public function operationFailed($e)
    {
      if ( gettype($e) === 'string'  ) {
        $message = $e;
      } else {
        $message = "There was a problem completing your request :" . $e->getMessage();
      }
      return [
        "errors" => true,
        "message" => $message,
      ];
    }
}
