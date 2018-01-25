<?php

class DatabaseApiTest extends ApiTest {

  public $mass_update_changes = 
  [ 
    'inactive_flag' => 0, 
  ];

  public function __construct()
  {
    $this->model_class = "App\\Database";
    $this->model_short = 'Database';
    $this->friendly_identifier = 'name';

    parent::__construct();
  }

}
