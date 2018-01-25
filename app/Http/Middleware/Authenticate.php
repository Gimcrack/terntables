<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if ( Auth::guard($guard)->guest() ) {
            if ($request->ajax() || $request->wantsJson() || $this->isApiCall($request)) {
              return response()->json([
                'errors' => true,
                'message' => "You must be logged on as a user to do that."
              ], 403);
            } 
            
            return redirect()->guest('auth/login');
        }

        return $next($request);
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // set to true instead of false
        return true;
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


}
