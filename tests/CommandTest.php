<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Group;
use App\User;

abstract class CommandTest extends TestCase
{
    use DatabaseMigrations;


    public function command($command)
    {
        Artisan::call($command);

        return Artisan::output();
    }
}