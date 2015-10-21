<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Active Directory user
     * @var [String]
     */
    protected $aduser;

    /**
     * The username of the user
     * @var [type]
     */
    protected $username = 'username';

    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'getLogout']);

        $this->aduser = (!empty($_SERVER['PHP_AUTH_USER'])) ?
          explode("\\",$_SERVER['PHP_AUTH_USER'])[1] :
          '';
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'username' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|confirmed|min:6',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }

    /**
     * Attempt to login ad user
     * @method adlogin
     * @param  array   $data [description]
     * @return [type]        [description]
     */
    public function adlogin(Request $request)
    {
      $throttles = $this->isUsingThrottlesLoginsTrait();

      if ($throttles && $this->hasTooManyLoginAttempts($request))
      {
          return $this->sendLockoutResponse($request);
      }

      if ( $this->isValidADUser() )
      {
          Auth::login($this->getUserByADLogin());
          return $this->handleUserWasAuthenticated($request, $throttles);
      } else {
        if ($throttles) {
            $this->incrementLoginAttempts($request);
        }

        return redirect($this->loginPath())
            ->withInput($request->only($this->loginUsername(), 'remember'))
            ->withErrors([
                $this->loginUsername() => $this->getFailedLoginMessage(),
            ]);
      }
    }

    private function isValidADUser()
    {
        $user = $this->getUserByADLogin();

        if ($user === false) { return false; }

        return (Boolean) $user->groups()
          ->where('name','AD Users')
          ->count();
    }

    private function getUserByADLogin()
    {
      $user = User::where('username', 'like', $this->aduser)->first();
      return ( !empty($user) ) ? $user : false;
    }
}
