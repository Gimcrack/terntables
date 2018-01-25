<?php

namespace App\Http\Middleware;

use Closure;
use App\User;
use Auth;
use Laracasts\Flash\Flash;
use Exception;

class CheckAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role, $guard='api')
    {
        if (Auth::guard($guard)->check() && Auth::guard($guard)->user()->checkAccess($role) ) {
          return $next($request);
        }

        if ($request->wantsJson() ) {
          throw new Exception( "You must be logged as a user with {$role} priviledges to do that."  );
        }

        Flash::error("You must be logged as a user with {$role} priviledges to do that.");

        return redirect('/auth/login');
    }
}
