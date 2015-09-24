<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Laracasts\Flash\Flash;

class Administrator
{
  /**
   * The Guard implementation.
   *
   * @var Guard
   */
  protected $auth;

  /**
   * Create a new filter instance.
   *
   * @param  Guard  $auth
   * @return void
   */
  public function __construct(Guard $auth)
  {
      $this->auth = $auth;
  }

  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
      // determine first if user is logged in
      if ($this->auth->guest()) {
          if ($request->ajax()) {
              return response('Unauthorized.', 401);
          } else {
              return redirect()->guest('auth/login');
          }
      }

      // now determine if logged in user is an admin
      if ( $this->auth->user()->isAdmin() ) {
        return $next($request);
      } else {
        Flash::error('You must be logged on as an administrator to do that.');
        return redirect('/');
      }


  }
}
