<?php

namespace App;

use App\User;

class Profile extends User
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['username', 'email'];
}
