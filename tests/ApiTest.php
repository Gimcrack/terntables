<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;


abstract class ApiTest extends TestCase
{
    use DatabaseTransactions;
    //use WithoutMiddleware;

    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = '/api/v1';

    public function setUp() {
      parent::setUp();
      Auth::loginUsingId(1);
    }

    /**
     * See that the operation was successful
     * @method seeJsonSuccess
     * @return [type]         [description]
     */
    public function seeJsonSuccess()
    {
      return $this->seeJsonContains(["errors" => false]);
    }

    /**
     * See that there was an error performing the operation
     * @method seeJsonError
     * @return [type]       [description]
     */
    public function seeJsonError()
    {
      return $this->seeJsonContains(["errors" => true]);
    }


}
