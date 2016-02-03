<?php

namespace App\Exceptions;

use Exception;
use App\Exceptions\OperationRequiresCheckoutException;
use App\Exceptions\ModelCheckedOutToSomeoneElseException;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        HttpException::class,
        ModelNotFoundException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        return parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
        if ($request->wantsJson() || $this->isApiCall($request) ) {
          return $this->renderForApiCall($request, $e);
        }

        if ($e instanceof ModelNotFoundException) {
            $e = new NotFoundHttpException($e->getMessage(), $e);
        }

        return parent::render($request, $e);
    }

    /**
     * Render an exception for an api call
     * @method renderForApiCall
     * @param  [type]           $request [description]
     * @param  Exception        $e       [description]
     * @return [type]                    [description]
     */
    public function renderForApiCall($request, Exception $e)
    {
      // Define the response
      $response = $this->getDefaultErrorResponse();

      // Default status of 400
      $status = 400;

      // If the app is in debug mode
      if (config('app.debug'))
      {
          // Add the exception class name, message and stack trace to response
          $response['exception'] = get_class($e); // Reflection might be better here
          $response['message'] = $e->getMessage();
          //$response['trace'] = $e->getTrace();
      }

      switch( $e ) {

        case ($e instanceof ModelNotFoundException) :
          $response['message'] = "Sorry, I was unable to find a record with that id.";
          $status = 404;
        break;

        case ($e instanceof HttpException) :
          $status = $e->getStatusCode();
        break;

        case ($e instanceof OperationRequiresCheckoutException) :
        case ($e instanceof ModelCheckedOutToSomeoneElseException) :
          $response['message'] = $e->getMessage();
          $response['explanation'] = $e->getExplanation();
          $status = $e->getCode();
        break;
      }

      // Return a JSON response with the response array and status code
      return response()->json($response, $status);
    }

    /**
     * Get the default error response
     * @method getDefaultErrorResponse
     * @return [type]                  [description]
     */
    protected function getDefaultErrorResponse()
    {
      return [
          'errors' => true,
          'message' => 'Sorry, something went wrong.'
      ];
    }

    /**
     * Determines if request is an api call.
     *
     * If the request URI contains '/api/v'.
     *
     * @param Request $request
     * @return bool
     */
    protected function isApiCall($request)
    {
      return strpos($request->getUri(), 'api/v') !== false;
    }

    /**
     * Determines if the given exception is an Eloquent model not found.
     *
     * @param Exception $e
     * @return bool
     */
    protected function isModelNotFoundException($e)
    {
        return $e instanceof ModelNotFoundException;
    }
}
