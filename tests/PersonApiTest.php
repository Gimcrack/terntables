<?php

class PersonApiTest extends ApiTest {


  public function __construct()
  {
    $this->model_class = "App\\Person";
    $this->model_short = 'Person';
    $this->friendly_identifier = 'name';

    parent::__construct();
  }

  // Person Tests

  // Person does not have any mass updatable fields
  public function testUpdateMultipleModels() {}


}
