<?php

class ServerApiTest extends ApiTest {

  public $mass_update_changes = 
  [ 
    'inactive_flag' => 0, 
    'production_flag' => 0 
  ];

  public function __construct()
  {
    $this->model_class = "App\\Server";
    $this->model_short = 'Server';
    $this->friendly_identifier = 'name';

    parent::__construct();
  }

}
