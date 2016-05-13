<?php

class AppAlertApiTest extends ApiTest {

  public function __construct()
  {
    $this->model_class = "App\\Alert";
    $this->model_short = 'Alert';
    $this->friendly_identifier = 'message';

    parent::__construct();
  }

  // Alert Tests

  // Alert does not have any mass updatable fields
  public function testUpdateMultipleModels() {}

  public function getNewNamearray()
  {
    return ['message' => 'hello world'];
  }
  
}
