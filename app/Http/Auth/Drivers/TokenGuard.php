<?php

namespace App\Http\Auth\Drivers;

use Illuminate\Auth\TokenGuard as BaseTokenGuard;

class TokenGuard extends BaseTokenGuard {

    /**
     * The token to try
     */
    protected $inputToken;

	/**
     * Get the token for the current request.
     *
     * @return string
     */
    protected function getTokenForRequest()
    {   
        $token = $this->inputToken;

        if (empty($token))
        {
            $token = $this->request->input($this->inputKey);    
        }
        
        if (empty($token)) {
            $token = $this->request->headers->get('x-api-token');
        }

        if (empty($token)) {
            $token = $this->request->bearerToken();
        }

        if (empty($token)) {
            $token = $this->request->getPassword();
        }

        return $token;
    }

    /**
     * Login a user with a token
     *
     * @param      <type>  $token  (description)
     */
    public function loginUsingToken( $token )
    {
        $this->inputToken = $token;
    }

    /**
     * Log the user out;
     */
    public function logout()
    {
        $this->inputToken = null;
    }

}