<?php

class UserApiTest extends ApiTest {


  public function __construct()
  {
    $this->model_class = "App\\User";
    $this->model_short = 'User';
    $this->friendly_identifier = 'username';

    parent::__construct();
  }

  // Person Tests

  // Person does not have any mass updatable fields
  public function testUpdateMultipleModels() {}


}
