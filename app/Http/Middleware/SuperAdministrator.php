<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Laracasts\Flash\Flash;

class SuperAdministrator
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
    // determine first if user is logged in
    if ( Auth::guard($guard)->guest() ) 
    {
        if ($request->ajax() || $request->wantsJson() || $this->isApiCall($request) ) 
        {
          return response()->json([
            'errors' => true,
            'message' => "You must be logged on as a super administrator to do that."
          ], 403);
        } 
        
        return redirect()->guest('auth/login');
    }

    // now determine if logged in user is an admin
    if ( ! Auth::guard($guard)->user()->isSuperAdmin() ) 
    {
      if ($request->ajax() || $request->wantsJson() || $this->isApiCall($request)) 
      {
        return response()->json([
          'errors' => true,
          'message' => "You must be logged on as a super administrator to do that."
        ], 403);
      } 

      Flash::error('You must be logged on as a super administrator to do that.');
      return redirect()->guest('auth/login');
    } 

    return $next($request);
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
